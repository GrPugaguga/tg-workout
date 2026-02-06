# Лаба 5 — RabbitMQ + AI Service

## Цель

Интегрировать RabbitMQ для асинхронного взаимодействия между сервисами. Создать AI Service для парсинга тренировок. Реализовать паттерны надёжности: Inbox/Outbox, Retry, Circuit Breaker, Dead Letter Queue.

**Время:** 6-7 часов
**Паттерны:** Inbox/Outbox, Saga, Retry, Circuit Breaker, Dead Letter Queue, Idempotency, Event-Driven Architecture

---

## Теория

### RabbitMQ Основы

**Компоненты:**

- **Producer** — отправляет сообщения
- **Exchange** — маршрутизирует сообщения в очереди
- **Queue** — хранит сообщения
- **Consumer** — получает и обрабатывает сообщения
- **Binding** — связь между Exchange и Queue

**Типы Exchange:**

- **Direct** — по точному routing key
- **Topic** — по паттерну (workout.* , *.created)
- **Fanout** — во все привязанные очереди
- **Headers** — по заголовкам

**Для нашего проекта:** Topic exchange для гибкой маршрутизации.

### Message Acknowledgment

**Проблема:** Consumer получил сообщение, начал обработку, упал. Сообщение потеряно.

**Решение:** Manual acknowledgment.

```
1. Consumer получает сообщение (не удаляется из очереди)
2. Consumer обрабатывает
3. Consumer отправляет ACK
4. RabbitMQ удаляет сообщение из очереди
```

Если consumer упал до ACK — сообщение вернётся в очередь.

### Inbox Pattern

**Проблема:** Сообщение обработано, ACK отправлен, но сервис упал до сохранения результата. При retry — дубликат.

**Решение:** Сначала сохраняем сообщение в inbox таблицу.

```
1. Получили сообщение
2. Проверили: уже в inbox? → пропускаем (идемпотентность)
3. Сохранили в inbox (статус: received)
4. Отправили ACK
5. Обработали
6. Обновили inbox (статус: processed)
```

### Outbox Pattern

**Проблема:** Сохранили данные в БД, отправляем событие в RabbitMQ, RabbitMQ недоступен — событие потеряно, но данные сохранены.

**Решение:** Сохраняем событие в outbox в той же транзакции.

```
Transaction:
  1. Сохранить Workout в БД
  2. Сохранить WorkoutCreatedEvent в outbox

Background process (Outbox Processor):
  1. Читает непереданные события из outbox
  2. Отправляет в RabbitMQ
  3. Помечает как отправленные
```

### Retry с Exponential Backoff

**Проблема:** Внешний сервис временно недоступен.

**Решение:** Повторяем с увеличивающимися интервалами.

```
Attempt 1: сразу
Attempt 2: через 1 сек
Attempt 3: через 2 сек
Attempt 4: через 4 сек
Attempt 5: через 8 сек
```

Формула: `delay = baseDelay * 2^attempt`

### Circuit Breaker

**Проблема:** Сервис упал. Продолжаем слать запросы → копим очередь → перегружаем систему.

**Состояния:**

```
CLOSED (нормальная работа)
    │
    │ N ошибок подряд
    ▼
OPEN (отклоняем запросы сразу)
    │
    │ timeout истёк
    ▼
HALF-OPEN (пробуем один запрос)
    │
    ├─ успех → CLOSED
    └─ ошибка → OPEN
```

### Dead Letter Queue (DLQ)

**Проблема:** Сообщение не может быть обработано (баг, невалидные данные). Бесконечный retry.

**Решение:** После N неудачных попыток → в DLQ для ручного разбора.

```
Main Queue → Consumer → Ошибка → retry 1, 2, 3... → DLQ
```

### Idempotency

**Проблема:** Сообщение обработано дважды → дубликат данных.

**Решение:** Каждое сообщение имеет уникальный ID. Проверяем перед обработкой.

```typescript
async processMessage(message: Message) {
  const exists = await this.inbox.findByMessageId(message.id);
  if (exists) {
    return; // уже обработано
  }
  
  await this.inbox.save({ messageId: message.id, ... });
  await this.process(message);
}
```

---

## Ресурсы

- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [NestJS Microservices — RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq)
- [Circuit Breaker Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
- [Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)

---

## Задачи

### Задача 5.1: RabbitMQ в Docker Compose

Обнови docker-compose.yml:

```yaml
rabbitmq:
  image: rabbitmq:3-management
  ports:
    - "5672:5672"    # AMQP
    - "15672:15672"  # Management UI
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASSWORD: guest
  volumes:
    - rabbitmq_data:/var/lib/rabbitmq
```

Проверь что Management UI доступен на http://localhost:15672

---

### Задача 5.2: Контракты сообщений

Обнови `packages/contracts`:

**Commands:**
```
commands/
├── parse-workout.command.ts
└── index.ts
```

ParseWorkoutCommand:
- messageId — UUID (для идемпотентности)
- userId — string
- text — string (текст от пользователя)
- correlationId — string
- timestamp — Date

**Events:**
```
events/
├── workout-parsed.event.ts
├── workout-parse-failed.event.ts
├── workout-created.event.ts
└── index.ts
```

WorkoutParsedEvent:
- messageId — UUID
- correlationId — string
- userId — string
- exercises — Array<{ name, sets, reps, weight }>
- confidence — number (0-1, уверенность AI)

WorkoutParseFailedEvent:
- messageId — UUID
- correlationId — string
- userId — string
- reason — string
- originalText — string

---

### Задача 5.3: RabbitMQ модуль (shared)

Создай `packages/rabbitmq` или добавь в utils:

**RabbitMQService:**
- connect(url: string): Promise<void>
- publish(exchange: string, routingKey: string, message: any): Promise<void>
- subscribe(queue: string, handler: (message) => Promise<void>): Promise<void>
- close(): Promise<void>

**Конфигурация exchanges и queues:**
```typescript
export const EXCHANGES = {
  COMMANDS: 'commands',
  EVENTS: 'events',
  DLX: 'dlx', // Dead Letter Exchange
};

export const QUEUES = {
  PARSE_WORKOUT: 'parse-workout',
  WORKOUT_EVENTS: 'workout-events',
  USER_EVENTS: 'user-events',
  DLQ: 'dead-letter-queue',
};

export const ROUTING_KEYS = {
  PARSE_WORKOUT: 'workout.parse',
  WORKOUT_CREATED: 'workout.created',
  WORKOUT_PARSED: 'workout.parsed',
  WORKOUT_PARSE_FAILED: 'workout.parse.failed',
};
```

---

### Задача 5.4: AI Service — структура

Создай `apps/ai-service`:

```
apps/ai-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── parsing/
│   │   ├── parsing.module.ts
│   │   ├── parsing.service.ts
│   │   ├── parsing.consumer.ts
│   │   └── dto/
│   ├── gigachat/
│   │   ├── gigachat.module.ts
│   │   ├── gigachat.service.ts
│   │   └── gigachat.types.ts
│   ├── infrastructure/
│   │   ├── inbox/
│   │   └── outbox/
│   └── health/
├── package.json
└── tsconfig.json
```

---

### Задача 5.5: GigaChat интеграция

Создай `GigaChatService`:

**Методы:**
- authenticate(): Promise<string> — получить access token
- complete(prompt: string): Promise<string> — отправить запрос

**Промпт для парсинга:**
```
Распарси текст тренировки в JSON формат.

Текст: "{userText}"

Ответ в формате JSON:
{
  "exercises": [
    {
      "name": "название упражнения на русском",
      "sets": число подходов,
      "reps": число повторений,
      "weight": вес в кг (0 если не указан)
    }
  ],
  "confidence": число от 0 до 1
}

Если не удалось распознать, верни:
{
  "error": "причина",
  "exercises": []
}
```

---

### Задача 5.6: Parsing Service

Создай `ParsingService`:

**Метод:**
```typescript
async parseWorkout(text: string): Promise<ParseResult> {
  const prompt = this.buildPrompt(text);
  const response = await this.gigachat.complete(prompt);
  return this.parseResponse(response);
}
```

**Обработка ошибок:**
- GigaChat недоступен → retry с backoff
- Невалидный ответ → WorkoutParseFailedEvent
- Успех → WorkoutParsedEvent

---

### Задача 5.7: Inbox Service

Создай `InboxService`:

**Методы:**
- isProcessed(messageId: string): Promise<boolean>
- markReceived(message: InboxMessage): Promise<void>
- markProcessed(messageId: string): Promise<void>
- markFailed(messageId: string, error: string): Promise<void>

**Entity InboxMessage** (используй из packages/database):
- id
- messageId (unique)
- messageType
- payload (jsonb)
- status (received, processing, processed, failed)
- processedAt
- error
- retryCount
- createdAt

---

### Задача 5.8: Outbox Service

Создай `OutboxService`:

**Методы:**
- save(event: OutboxMessage): Promise<void>
- getUnsentEvents(limit: number): Promise<OutboxMessage[]>
- markSent(id: string): Promise<void>
- markFailed(id: string, error: string): Promise<void>

**Outbox Processor** (background job):
```typescript
@Injectable()
export class OutboxProcessor {
  @Cron('*/5 * * * * *') // каждые 5 секунд
  async processOutbox() {
    const events = await this.outboxService.getUnsentEvents(10);
    
    for (const event of events) {
      try {
        await this.rabbitmq.publish(
          EXCHANGES.EVENTS,
          event.routingKey,
          event.payload
        );
        await this.outboxService.markSent(event.id);
      } catch (error) {
        await this.outboxService.markFailed(event.id, error.message);
      }
    }
  }
}
```

---

### Задача 5.9: Parsing Consumer

Создай `ParsingConsumer`:

```typescript
@Injectable()
export class ParsingConsumer implements OnModuleInit {
  async onModuleInit() {
    await this.rabbitmq.subscribe(
      QUEUES.PARSE_WORKOUT,
      this.handleMessage.bind(this)
    );
  }

  async handleMessage(message: ParseWorkoutCommand) {
    // 1. Idempotency check
    if (await this.inbox.isProcessed(message.messageId)) {
      return; // уже обработано
    }
    
    // 2. Save to inbox
    await this.inbox.markReceived({
      messageId: message.messageId,
      messageType: 'ParseWorkoutCommand',
      payload: message,
    });
    
    try {
      // 3. Process
      const result = await this.parsingService.parseWorkout(message.text);
      
      // 4. Save event to outbox
      if (result.exercises.length > 0) {
        await this.outboxService.save({
          eventType: ROUTING_KEYS.WORKOUT_PARSED,
          payload: {
            messageId: uuid(),
            correlationId: message.correlationId,
            userId: message.userId,
            exercises: result.exercises,
            confidence: result.confidence,
          },
        });
      } else {
        await this.outboxService.save({
          eventType: ROUTING_KEYS.WORKOUT_PARSE_FAILED,
          payload: {
            messageId: uuid(),
            correlationId: message.correlationId,
            userId: message.userId,
            reason: result.error || 'No exercises found',
            originalText: message.text,
          },
        });
      }
      
      // 5. Mark as processed
      await this.inbox.markProcessed(message.messageId);
      
    } catch (error) {
      await this.inbox.markFailed(message.messageId, error.message);
      throw error; // для retry
    }
  }
}
```

---

### Задача 5.10: Circuit Breaker

Создай `CircuitBreaker` class:

**Состояния:**
- CLOSED — нормальная работа
- OPEN — отклоняем запросы
- HALF_OPEN — тестируем один запрос

**Конфигурация:**
- failureThreshold — сколько ошибок для открытия (default: 5)
- resetTimeout — через сколько пробовать снова (default: 30 сек)

**Методы:**
- execute<T>(fn: () => Promise<T>): Promise<T>
- getState(): CircuitState

**Использование:**
```typescript
const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
});

try {
  const result = await breaker.execute(() => this.gigachat.complete(prompt));
} catch (error) {
  if (error instanceof CircuitOpenError) {
    // сервис недоступен, не пытаемся
  }
}
```

---

### Задача 5.11: Retry с Exponential Backoff

Создай `RetryService`:

**Метод:**
```typescript
async withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000 } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}
```

---

### Задача 5.12: Dead Letter Queue

Настрой DLQ в RabbitMQ:

1. Создай DLX (Dead Letter Exchange)
2. Создай DLQ (Dead Letter Queue)
3. Настрой основные очереди с DLX:

```typescript
await channel.assertQueue(QUEUES.PARSE_WORKOUT, {
  durable: true,
  deadLetterExchange: EXCHANGES.DLX,
  deadLetterRoutingKey: 'dlq',
  arguments: {
    'x-message-ttl': 60000, // 60 сек
    'x-max-retries': 3,
  },
});
```

Создай consumer для DLQ который логирует failed messages.

---

### Задача 5.13: Интеграция с Workout Service

Обнови Workout Service для получения событий:

**WorkoutEventsConsumer:**
- Подписывается на ROUTING_KEYS.WORKOUT_PARSED
- Создаёт Workout из распарсенных данных
- Публикует WORKOUT_CREATED event

```typescript
async handleWorkoutParsed(event: WorkoutParsedEvent) {
  // 1. Idempotency check
  // 2. Match exercises с справочником
  // 3. Создать Workout
  // 4. Опубликовать WorkoutCreatedEvent
}
```

---

### Задача 5.14: Интеграция с Gateway

Добавь mutation в Gateway для отправки команды:

```graphql
mutation {
  parseWorkout(text: "жим 100кг 3х10, присед 80кг 4х8") {
    success
    message
    correlationId
  }
}
```

Gateway:
1. Генерирует correlationId
2. Публикует ParseWorkoutCommand в RabbitMQ
3. Возвращает correlationId клиенту

Клиент потом может подписаться на результат или poll'ить по correlationId.

---

### Задача 5.15: Health Checks

Добавь health check для RabbitMQ:

```typescript
@Get('health')
async health() {
  return {
    status: 'ok',
    rabbitmq: await this.checkRabbitMQ(),
    gigachat: await this.checkGigaChat(),
    database: await this.checkDatabase(),
  };
}
```

---

## Ожидаемый результат

После выполнения:

1. **AI Service** запускается и подключается к RabbitMQ
2. **Парсинг** работает через GigaChat
3. **Inbox/Outbox** гарантируют доставку
4. **Retry** с exponential backoff работает
5. **Circuit Breaker** защищает от каскадных сбоев
6. **DLQ** собирает failed messages
7. **Idempotency** предотвращает дубликаты
8. **Workout Service** получает события и создаёт тренировки

---

## Проверочные вопросы

1. Зачем нужен Inbox pattern если есть RabbitMQ ACK?
2. Почему Outbox сохраняется в той же транзакции что и основные данные?
3. Что произойдёт если Circuit Breaker в состоянии OPEN?
4. Когда сообщение попадает в DLQ?
5. Как Idempotency Key предотвращает дубликаты?
6. Почему exponential backoff лучше fixed delay?

---

## Чеклист завершения

- [ ] RabbitMQ запускается в Docker
- [ ] AI Service подключается к RabbitMQ
- [ ] ParseWorkoutCommand обрабатывается
- [ ] GigaChat возвращает результат
- [ ] Inbox сохраняет входящие сообщения
- [ ] Outbox отправляет события
- [ ] Retry работает при ошибках
- [ ] Circuit Breaker открывается после N ошибок
- [ ] DLQ получает failed messages
- [ ] Workout Service создаёт тренировки из событий
