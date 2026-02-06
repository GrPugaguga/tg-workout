# TG Workout — Архитектура проекта

## Обзор

Telegram бот + Mini App для отслеживания тренировок. Пользователь пишет боту текст вроде "жим 100кг 3х10, присед 80кг 4х8", AI парсит это в структурированные данные, система сохраняет тренировку.

**Цель проекта:** Изучить построение production-ready микросервисной архитектуры.

---

## Сервисы

```
┌─────────────┐     ┌─────────────┐
│   TG Bot    │     │  Mini App   │
│  (grammy)   │     │  (Next.js)  │
└──────┬──────┘     └──────┬──────┘
       │                   │
       │    GraphQL        │
       └─────────┬─────────┘
                 ▼
       ┌─────────────────┐
       │     Gateway     │
       │   (GraphQL)     │
       │                 │
       │  - Auth check   │
       │  - Routing      │
       │  - Orchestration│
       └────────┬────────┘
                │
       ┌────────┼────────┐
       │        │        │
       ▼        ▼        ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   User   │ │ Workout  │ │    AI    │
│ Service  │ │ Service  │ │ Service  │
├──────────┤ ├──────────┤ ├──────────┤
│ - Users  │ │- Workouts│ │- GigaChat│
│ - Auth   │ │- Exercises│ │- Parsing │
│          │ │          │ │          │
│ PostgreSQL│ │PostgreSQL│ │    —     │
└──────────┘ └──────────┘ └──────────┘
       │        │        │
       └────────┼────────┘
                │
         ┌──────▼──────┐
         │  RabbitMQ   │
         │             │
         │ - Events    │
         │ - Commands  │
         └─────────────┘
```

---

## Сервисы и их ответственность

| Сервис | Ответственность | База данных | Связь |
|--------|-----------------|-------------|-------|
| **Gateway** | Единая точка входа, GraphQL API, аутентификация, маршрутизация | — | GraphQL Federation |
| **User Service** | Регистрация, профили, JWT токены | PostgreSQL | GraphQL + RabbitMQ events |
| **Workout Service** | Тренировки, упражнения, статистика | PostgreSQL | GraphQL + RabbitMQ events |
| **AI Service** | Парсинг текста тренировки, GigaChat | — | RabbitMQ (request-reply) |
| **TG Bot** | Telegram интерфейс, команды, сцены | — | GraphQL к Gateway |

---

## Структура монорепо

```
tg-workout/
├── package.json                    # Root package с workspaces
├── docker-compose.yml              # Вся инфраструктура
├── .env.example
│
├── apps/
│   ├── gateway/                    # GraphQL Gateway
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── user-service/               # User microservice
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── user/
│   │   │   │   ├── user.module.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.resolver.ts
│   │   │   │   ├── entities/
│   │   │   │   ├── dto/
│   │   │   │   └── repositories/
│   │   │   └── auth/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── workout-service/            # Workout microservice
│   │   ├── src/
│   │   │   ├── workout/
│   │   │   ├── exercise/
│   │   │   └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ai-service/                 # AI microservice
│   │   ├── src/
│   │   │   ├── parsing/
│   │   │   ├── gigachat/
│   │   │   └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── bot/                        # Telegram bot
│       ├── src/
│       │   ├── scenes/
│       │   ├── commands/
│       │   └── ...
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── contracts/                  # Общие контракты
│   │   ├── src/
│   │   │   ├── events/             # События RabbitMQ
│   │   │   │   ├── user-created.event.ts
│   │   │   │   ├── workout-created.event.ts
│   │   │   │   └── index.ts
│   │   │   ├── commands/           # Команды RabbitMQ
│   │   │   │   ├── parse-workout.command.ts
│   │   │   │   └── index.ts
│   │   │   ├── dto/                # Общие DTO
│   │   │   │   ├── user.dto.ts
│   │   │   │   ├── workout.dto.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                      # Общие утилиты
│   │   ├── src/
│   │   │   ├── logger.ts
│   │   │   ├── correlation-id.ts
│   │   │   ├── retry.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── database/                   # Общие database утилиты
│       ├── src/
│       │   ├── base.entity.ts
│       │   ├── base.repository.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── gateway.Dockerfile
│   │   ├── user-service.Dockerfile
│   │   └── ...
│   └── nginx/
│       └── nginx.conf
│
└── docs/
    ├── architecture.md
    ├── api.md
    └── deployment.md
```

---

## Shared пакеты (packages/)

### contracts/
Единый источник правды для типов и контрактов между сервисами.

**Зачем:** Если User Service отправляет событие, а Workout Service его слушает — оба должны знать структуру. Контракты в shared пакете гарантируют синхронизацию.

```typescript
// packages/contracts/src/events/user-created.event.ts
export const USER_CREATED_EVENT = 'user.created';

export interface UserCreatedEvent {
  userId: string;
  telegramId: number;
  username: string;
  createdAt: Date;
}
```

### utils/
Переиспользуемые утилиты: логгер, retry, correlation ID.

### database/
Базовые классы для entities и repositories.

---

## Взаимодействие сервисов

### Синхронное (GraphQL)

Когда нужен ответ сразу:

```
Bot: "Покажи мои тренировки"
  → Gateway (GraphQL query)
    → Workout Service
      → Ответ со списком
```

### Асинхронное (RabbitMQ)

Когда ответ не нужен сразу или операция долгая:

```
Bot: "жим 100кг 3х10"
  → Gateway (mutation)
    → RabbitMQ (ParseWorkoutCommand)
      → AI Service (парсит через GigaChat)
        → RabbitMQ (WorkoutParsedEvent)
          → Workout Service (сохраняет)
            → RabbitMQ (WorkoutCreatedEvent)
              → Bot (уведомляет пользователя)
```

---

## Паттерны надёжности

### Inbox Pattern

**Проблема:** Сообщение из RabbitMQ пришло, сервис начал обработку, упал, сообщение потеряно.

**Решение:** Сначала сохраняем сообщение в БД (inbox таблица), потом обрабатываем.

```
RabbitMQ → Inbox Table → Process → Mark as processed
```

### Outbox Pattern

**Проблема:** Сохранили данные в БД, отправляем событие в RabbitMQ, RabbitMQ недоступен — событие потеряно.

**Решение:** Сохраняем событие в БД (outbox таблица) в той же транзакции. Отдельный процесс читает outbox и отправляет в RabbitMQ.

```
Transaction: Save Data + Save to Outbox
Background: Outbox → RabbitMQ → Mark as sent
```

### Idempotency

**Проблема:** Сообщение обработано, но ACK не дошёл до RabbitMQ. RabbitMQ повторно отправляет. Данные дублируются.

**Решение:** Каждое сообщение имеет уникальный ID. Перед обработкой проверяем — уже обрабатывали?

### Circuit Breaker

**Проблема:** AI Service упал. Gateway продолжает слать запросы, копит очередь, перегружает систему.

**Решение:** После N неудачных попыток "размыкаем цепь" — сразу отдаём ошибку, не пытаясь достучаться. Периодически проверяем — ожил ли сервис.

### Dead Letter Queue (DLQ)

**Проблема:** Сообщение не может быть обработано (невалидные данные, баг). Бесконечный retry.

**Решение:** После N неудачных попыток отправляем в DLQ. Потом разбираемся вручную или автоматически.

### Retry с Exponential Backoff

**Проблема:** Сервис временно недоступен. Моментальный retry не помогает.

**Решение:** Повторяем с увеличивающимися интервалами: 1с, 2с, 4с, 8с...

---

## Масштабирование

### Horizontal Scaling

Запускаем несколько инстансов одного сервиса:

```yaml
# docker-compose.yml
workout-service:
  image: workout-service
  deploy:
    replicas: 3
```

### Требования для масштабирования

**Stateless сервисы:**
- Никакого состояния в памяти между запросами
- Сессии в Redis, не в памяти
- Файлы в S3, не на диске

**Database Connection Pooling:**
- 3 инстанса × 10 соединений = 30 соединений к БД
- Используем PgBouncer или встроенный пул TypeORM

**Load Balancing:**
- Nginx или Docker Swarm/Kubernetes распределяют запросы

### Consumer Scaling (RabbitMQ)

Несколько инстансов читают одну очередь — RabbitMQ распределяет сообщения:

```
Queue: parse-workout
  → AI Service Instance 1
  → AI Service Instance 2
  → AI Service Instance 3
```

---

## Observability

### Correlation ID

Уникальный ID запроса, который проходит через все сервисы:

```
Bot → Gateway → User Service → RabbitMQ → AI Service
       │           │              │           │
       └───────────┴──────────────┴───────────┘
                   correlation-id: abc-123
```

Все логи содержат этот ID — легко отследить путь запроса.

### Structured Logging

```json
{
  "level": "info",
  "message": "Workout created",
  "correlationId": "abc-123",
  "userId": "user-456",
  "workoutId": "workout-789",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Health Checks

Каждый сервис имеет endpoint `/health`:

```json
{
  "status": "healthy",
  "database": "connected",
  "rabbitmq": "connected",
  "uptime": 3600
}
```

---

## База данных

### User Service DB

```
users
├── id (UUID, PK)
├── telegram_id (BIGINT, UNIQUE)
├── username (VARCHAR)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

inbox
├── id (UUID, PK)
├── message_id (VARCHAR, UNIQUE)
├── message_type (VARCHAR)
├── payload (JSONB)
├── processed_at (TIMESTAMP, NULL)
└── created_at (TIMESTAMP)

outbox
├── id (UUID, PK)
├── event_type (VARCHAR)
├── payload (JSONB)
├── sent_at (TIMESTAMP, NULL)
└── created_at (TIMESTAMP)
```

### Workout Service DB

```
exercises (справочник)
├── id (UUID, PK)
├── name (VARCHAR)
├── aliases (VARCHAR[])
├── muscle_group (VARCHAR)
└── equipment (VARCHAR)

workouts
├── id (UUID, PK)
├── user_id (UUID, FK)
├── date (DATE)
├── notes (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

workout_exercises
├── id (UUID, PK)
├── workout_id (UUID, FK)
├── exercise_id (UUID, FK)
├── sets (INT)
├── reps (INT)
├── weight (DECIMAL)
├── order_index (INT)
└── notes (TEXT)

inbox / outbox (аналогично)
```

---

## Аутентификация

### Telegram → Bot → Gateway

```
1. User открывает бота
2. Telegram передаёт initData (подписанные данные)
3. Bot валидирует подпись
4. Bot запрашивает Gateway с заголовком X-Telegram-User-Id
5. Gateway доверяет боту (service-to-service auth)
```

### Mini App → Gateway

```
1. Mini App получает initData от Telegram
2. Mini App отправляет initData в Gateway
3. Gateway валидирует подпись Telegram
4. Gateway выдаёт JWT
5. Дальнейшие запросы с JWT
```

---

## Docker Compose (обзор)

```yaml
services:
  # Infrastructure
  postgres-user:
    image: postgres:15
  postgres-workout:
    image: postgres:15
  rabbitmq:
    image: rabbitmq:3-management
  
  # Services
  gateway:
    build: ./apps/gateway
    depends_on: [rabbitmq]
  user-service:
    build: ./apps/user-service
    depends_on: [postgres-user, rabbitmq]
  workout-service:
    build: ./apps/workout-service
    depends_on: [postgres-workout, rabbitmq]
  ai-service:
    build: ./apps/ai-service
    depends_on: [rabbitmq]
  bot:
    build: ./apps/bot
    depends_on: [gateway]
```

---

## Словарь терминов

| Термин | Описание |
|--------|----------|
| **Микросервис** | Независимо деплоящийся сервис с одной ответственностью |
| **API Gateway** | Единая точка входа для всех клиентов |
| **Message Broker** | Посредник для асинхронного обмена сообщениями (RabbitMQ) |
| **Event** | Уведомление о том, что что-то произошло (UserCreated) |
| **Command** | Запрос на выполнение действия (ParseWorkout) |
| **Eventual Consistency** | Данные между сервисами синхронизируются не мгновенно |
| **Idempotency** | Повторный запрос даёт тот же результат |
| **Circuit Breaker** | Защита от каскадных сбоев |
| **DLQ** | Dead Letter Queue — очередь для необработанных сообщений |
| **Correlation ID** | ID для трекинга запроса через все сервисы |
| **Inbox/Outbox** | Паттерны гарантированной доставки сообщений |
