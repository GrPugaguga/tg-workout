# TG Workout App - Архитектура

## Обзор
Telegram бот + Mini App для отслеживания тренировок:
- Запись тренировок через бота (с ИИ парсингом через GigaChat)
- Просмотр прогресса в Mini App (Next.js)
- Микросервисная архитектура с NATS

## Стек

| Компонент | Технология |
|-----------|------------|
| Package manager | npm workspaces |
| Frontend | Next.js |
| Backend | NestJS |
| AI Provider | GigaChat |
| Message broker | NATS |
| Database | PostgreSQL + Drizzle |
| Deploy | VPS + Docker Compose |
| TG Bot lib | telegraf или grammy (TBD) |

## Архитектура

```
┌─────────────────┐         ┌─────────────────────────────────────┐
│   TG Bot        │  HTTP   │                                     │
│   Wrapper       │────────▶│         Main Server (Gateway)       │
│   (grammy)      │         │              NestJS                 │
└─────────────────┘         │                                     │
                            │  - REST API для Mini App            │
┌─────────────────┐         │  - Бизнес логика тренировок         │
│   Mini App      │  HTTP   │  - Оркестрация AI запросов          │
│   (Next.js)     │────────▶│                                     │
└─────────────────┘         └───────────────┬─────────────────────┘
                                            │
                            ┌───────────────┴───────────────┐
                            │              NATS             │
                            │   (request-reply + events)    │
                            └───────────────┬───────────────┘
                                            │
                            ┌───────────────┴───────────────┐
                            │          AI Service           │
                            │           (NestJS)            │
                            │                               │
                            │  - GigaChat integration       │
                            │  - Парсинг текста тренировки  │
                            │  - Поиск похожих упражнений   │
                            └───────────────────────────────┘
                                            │
                                      PostgreSQL
```

## Структура монорепо

```
tg-workout/
├── package.json              # root с workspaces
├── apps/
│   ├── api/                  # Main Server (NestJS)
│   ├── ai-service/           # AI Microservice (NestJS)
│   ├── bot/                  # TG Bot Wrapper
│   └── web/                  # Mini App (Next.js)
│
├── packages/
│   ├── database/             # Drizzle schemas + migrations
│   ├── shared/               # Общие типы и утилиты
│   └── nats-contracts/       # NATS message contracts
│
├── docker-compose.yml
└── .env.example
```

## Аутентификация

```
┌─────────────┐  initData   ┌─────────────┐  API Key    ┌─────────────┐
│   Telegram  │ ──────────▶ │   TG Bot    │ ──────────▶ │ Main Server │
│   User      │             │   Wrapper   │             │             │
└─────────────┘             │ (validates) │             │ (trusts)    │
                            └─────────────┘             └─────────────┘

┌─────────────┐  initData   ┌─────────────┐
│  Mini App   │ ──────────▶ │ Main Server │  (валидация initData на сервере)
└─────────────┘             └─────────────┘
```

- **TG Bot → Main Server**: API Key (service-to-service)
- **Mini App → Main Server**: Telegram initData validation

## Потоки данных

### Запись тренировки (через бота)
```
User → TG Bot (validates initData) → Main Server (API Key) → NATS → AI Service
                                                                        │
                                                                   GigaChat
                                                                        │
                                          NATS ← parsed data ←──────────┘
                                            │
                                      Main Server
                                            │
                          User confirmation → PostgreSQL (save)
```

### Просмотр в Mini App
```
User → Mini App (initData) → Main Server (validates) → PostgreSQL → Response
```

## База данных

### users
- id, telegram_id, username, first_name, last_name, avatar_url, created_at

### exercises (справочник)
- id, name, aliases[], muscle_group, equipment

### workouts
- id, user_id, date, notes, created_at

### workout_exercises
- id, workout_id, exercise_id, sets, reps, weight, max_reps, notes, tags[], order_index

### tags
- id, name

## Справочник упражнений (seed data)

Базовый набор захардкожен, позже пользователи смогут добавлять свои.

Примеры:
- Жим лёжа (aliases: bench press, жим штанги)
- Приседания (aliases: squat, присед)
- Становая тяга (aliases: deadlift, тяга)
- Подтягивания (aliases: pull-ups, подтяги)
- Жим стоя (aliases: overhead press, армейский жим)
- и т.д.

## Фазы реализации

1. **Инфраструктура** - монорепо, TypeScript, Docker Compose, Drizzle
2. **Main Server** - NestJS, CRUD, NATS клиент, REST API
3. **AI Service** - NestJS, NATS listener, GigaChat
4. **TG Bot** - grammy, webhook, сцены диалога
5. **Mini App** - Next.js, TG SDK, страницы
6. **Деплой** - Docker, VPS, Nginx
