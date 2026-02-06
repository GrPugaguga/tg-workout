# Лаба 1 — Монорепо и инфраструктура

## Цель

Создать структуру проекта, настроить npm workspaces, Docker Compose, shared пакеты. К концу лабы у тебя будет работающая инфраструктура для разработки.

**Время:** 4-5 часов
**Паттерны:** Monorepo, Shared Kernel, Contract-First Design

---

## Теория

### Monorepo

**Monorepo** — один репозиторий для нескольких проектов/пакетов.

**Альтернатива — Polyrepo:**
```
tg-workout-gateway/     ← отдельный репо
tg-workout-user-service/ ← отдельный репо
tg-workout-contracts/    ← отдельный репо, npm пакет
```

**Проблемы polyrepo:**
- Синхронизация версий между репо
- Изменил контракт — нужно обновить во всех репо
- Сложнее запускать локально всё вместе

**Monorepo решает:**
```
tg-workout/
├── apps/gateway/
├── apps/user-service/
├── packages/contracts/   ← общий код, не нужно публиковать в npm
└── package.json          ← workspaces
```

Изменил контракт — сразу видно где сломалось. Один PR — изменения во всех сервисах.

### npm Workspaces

Встроенный в npm способ организации monorepo.

```json
// root package.json
{
  "name": "tg-workout",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Что даёт:**
- `npm install` в корне — ставит зависимости для всех пакетов
- Shared пакеты линкуются автоматически (не нужен npm link)
- Общие зависимости поднимаются в корневой node_modules (hoisting)

**Команды:**
```bash
# Запустить скрипт в конкретном workspace
npm run dev -w apps/gateway

# Запустить во всех
npm run build --workspaces

# Добавить зависимость в конкретный workspace
npm install express -w apps/gateway
```

### Shared Kernel (DDD)

Общий код, который используется несколькими контекстами.

**Что выносить в shared:**
- Контракты (типы событий, DTO)
- Утилиты (logger, retry, correlation ID)
- Базовые классы (BaseEntity, BaseRepository)

**Что НЕ выносить:**
- Бизнес-логику конкретного сервиса
- Специфичные для сервиса типы

**Правило:** Shared kernel должен быть стабильным. Частые изменения = проблемы.

### Contract-First Design

Сначала описываем контракт (интерфейс), потом реализацию.

**Пример — событие:**
```typescript
// packages/contracts/src/events/workout-created.event.ts

export const WORKOUT_CREATED_EVENT = 'workout.created';

export interface WorkoutCreatedEvent {
  workoutId: string;
  odawuderId: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
  createdAt: string;
}
```

Теперь и publisher, и consumer используют один тип. TypeScript проверит совместимость.

### Docker Compose

Описывает всю инфраструктуру в одном файле.

**Зачем:**
- Одна команда `docker-compose up` — всё запущено
- Dev окружение идентично production
- Не нужно ставить PostgreSQL, RabbitMQ локально

**Основные концепции:**
- **Service** — контейнер (postgres, rabbitmq, gateway)
- **Volume** — постоянное хранилище (данные БД)
- **Network** — сеть для связи контейнеров
- **Depends_on** — порядок запуска

---

## Ресурсы

- [npm Workspaces Documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

## Задачи

### Задача 1.1: Инициализация проекта

Создай структуру папок:

```
tg-workout/
├── apps/
│   ├── gateway/
│   ├── user-service/
│   ├── workout-service/
│   ├── ai-service/
│   └── bot/
├── packages/
│   ├── contracts/
│   ├── utils/
│   └── database/
├── infrastructure/
│   └── docker/
├── package.json
├── tsconfig.base.json
├── .gitignore
├── .env.example
└── docker-compose.yml
```

Инициализируй root `package.json` с workspaces.

---

### Задача 1.2: Базовый tsconfig

Создай `tsconfig.base.json` в корне с общими настройками TypeScript.

Требования:
- strict mode
- ES2022 target
- NodeNext module resolution
- Включи decorators (для NestJS)
- paths для алиасов (@contracts, @utils)

Каждый app/package будет наследовать от него.

---

### Задача 1.3: Пакет contracts

Создай пакет `packages/contracts`:

Структура:
```
packages/contracts/
├── src/
│   ├── events/
│   │   ├── user-created.event.ts
│   │   ├── workout-created.event.ts
│   │   ├── workout-parsed.event.ts
│   │   └── index.ts
│   ├── commands/
│   │   ├── parse-workout.command.ts
│   │   └── index.ts
│   ├── dto/
│   │   ├── user.dto.ts
│   │   ├── workout.dto.ts
│   │   ├── exercise.dto.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

Для каждого события/команды создай:
- Константу с именем (routing key)
- Интерфейс с типом данных

---

### Задача 1.4: Пакет utils

Создай пакет `packages/utils`:

Структура:
```
packages/utils/
├── src/
│   ├── logger.ts
│   ├── correlation-id.ts
│   ├── retry.ts
│   ├── sleep.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

Реализуй:
- `logger` — обёртка над console с уровнями (info, warn, error) и structured output (JSON)
- `generateCorrelationId()` — генерация UUID
- `retry(fn, maxRetries, delay)` — повтор функции с задержкой
- `sleep(ms)` — промис с задержкой

---

### Задача 1.5: Пакет database

Создай пакет `packages/database`:

Структура:
```
packages/database/
├── src/
│   ├── base.entity.ts
│   ├── inbox.entity.ts
│   ├── outbox.entity.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

Реализуй:
- `BaseEntity` — базовый класс с id (UUID), createdAt, updatedAt
- `InboxMessage` — entity для inbox pattern (messageId, type, payload, processedAt)
- `OutboxMessage` — entity для outbox pattern (eventType, payload, sentAt)

---

### Задача 1.6: Docker Compose — инфраструктура

Создай `docker-compose.yml` с сервисами:

**PostgreSQL для User Service:**
- Имя: postgres-user
- Порт: 5433 (внешний) → 5432 (внутренний)
- Volume для данных
- Переменные: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

**PostgreSQL для Workout Service:**
- Имя: postgres-workout
- Порт: 5434 → 5432
- Свой volume

**RabbitMQ:**
- Имя: rabbitmq
- Порт: 5672 (AMQP), 15672 (Management UI)
- Volume для данных
- Default user/password

---

### Задача 1.7: Docker Compose — проверка

Запусти `docker-compose up -d` и проверь:
- PostgreSQL доступен на портах 5433, 5434
- RabbitMQ Management UI открывается на http://localhost:15672
- Данные сохраняются после перезапуска (volumes работают)

---

### Задача 1.8: Скелет Gateway

Создай базовый NestJS проект в `apps/gateway`:

```bash
cd apps/gateway
npm init -y
npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
npm install -D typescript @types/node
```

Структура:
```
apps/gateway/
├── src/
│   ├── main.ts
│   └── app.module.ts
├── package.json
└── tsconfig.json
```

Требования:
- Наследует tsconfig от корневого
- Использует пакет @tg-workout/utils для логгера
- Запускается на порту из env (default 3000)
- Endpoint GET /health возвращает { status: 'ok' }

---

### Задача 1.9: Скрипты запуска

Добавь в root package.json скрипты:

```json
{
  "scripts": {
    "dev:gateway": "npm run dev -w apps/gateway",
    "dev:user": "npm run dev -w apps/user-service",
    "dev:workout": "npm run dev -w apps/workout-service",
    "dev:ai": "npm run dev -w apps/ai-service",
    "dev:bot": "npm run dev -w apps/bot",
    "build": "npm run build --workspaces",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

---

### Задача 1.10: .env и конфигурация

Создай `.env.example`:

```env
# Gateway
GATEWAY_PORT=3000

# User Service
USER_SERVICE_PORT=3001
USER_DB_HOST=localhost
USER_DB_PORT=5433
USER_DB_NAME=users
USER_DB_USER=postgres
USER_DB_PASSWORD=postgres

# Workout Service
WORKOUT_SERVICE_PORT=3002
WORKOUT_DB_HOST=localhost
WORKOUT_DB_PORT=5434
WORKOUT_DB_NAME=workouts
WORKOUT_DB_USER=postgres
WORKOUT_DB_PASSWORD=postgres

# AI Service
AI_SERVICE_PORT=3003
GIGACHAT_API_KEY=

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Bot
BOT_TOKEN=
```

Добавь `.env` в `.gitignore`.

---

## Ожидаемый результат

После выполнения всех задач:

1. **Структура проекта** создана и соответствует схеме
2. **npm workspaces** работают — можно импортировать `@tg-workout/contracts` в apps
3. **Shared пакеты** содержат контракты, утилиты, базовые entity
4. **Docker Compose** запускает PostgreSQL (2 инстанса) и RabbitMQ
5. **Gateway** запускается и отвечает на /health
6. **TypeScript** настроен с путями и строгим режимом

---

## Проверочные вопросы

1. Зачем нужен monorepo? Какие проблемы решает?
2. Что делает npm workspaces под капотом?
3. Почему контракты вынесены в отдельный пакет?
4. Что такое hoisting в контексте npm workspaces?
5. Зачем два отдельных PostgreSQL вместо одного?
6. Как добавить новый shared пакет в monorepo?

---

## Чеклист завершения

- [ ] `npm install` в корне работает без ошибок
- [ ] `npm run build --workspaces` компилирует все пакеты
- [ ] `docker-compose up -d` запускает инфраструктуру
- [ ] Gateway запускается и использует shared utils
- [ ] Импорты `@tg-workout/contracts` работают в apps
- [ ] RabbitMQ UI доступен на localhost:15672
