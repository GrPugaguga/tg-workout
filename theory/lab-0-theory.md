# Лаба 0 — Теория микросервисной архитектуры

## Цель

Понять принципы микросервисной архитектуры, когда её применять, какие проблемы она решает и какие создаёт.

**Время:** 2-3 часа
**Формат:** Теория + размышления + проверочные вопросы

---

## 1. Монолит vs Микросервисы

### Монолит

Одно приложение, один деплой, одна база данных.

```
┌─────────────────────────────────┐
│           Монолит               │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │Users│ │Work-│ │ AI  │       │
│  │     │ │outs │ │     │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  ┌─────────────────────────┐   │
│  │      PostgreSQL         │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Плюсы:**
- Просто разрабатывать на старте
- Просто деплоить (один артефакт)
- Нет сетевых задержек между модулями
- Транзакции в одной БД — ACID гарантии
- Легко отлаживать

**Минусы:**
- Растёт — становится сложно понимать
- Деплой всего ради изменения в одном модуле
- Масштабирование только целиком
- Одна технология для всего
- Падает всё — падает целиком

### Микросервисы

Много маленьких приложений, каждое со своей базой, общаются по сети.

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Users   │  │ Workouts │  │    AI    │
│ Service  │  │ Service  │  │ Service  │
├──────────┤  ├──────────┤  ├──────────┤
│PostgreSQL│  │PostgreSQL│  │    —     │
└──────────┘  └──────────┘  └──────────┘
      │             │             │
      └─────────────┼─────────────┘
                    │
              Message Broker
```

**Плюсы:**
- Независимый деплой каждого сервиса
- Масштабирование только нужных частей
- Разные технологии для разных задач
- Падение одного не роняет всё
- Маленькие команды владеют сервисами

**Минусы:**
- Сетевые задержки
- Распределённые транзакции — сложно
- Eventual consistency вместо ACID
- Сложнее отлаживать
- Инфраструктурный overhead

### Когда что выбирать

**Монолит:**
- Стартап, MVP
- Маленькая команда (до 5-7 человек)
- Неясные требования (много экспериментов)
- Простой домен

**Микросервисы:**
- Большая команда (можно разделить по сервисам)
- Понятный домен (ясно как разделить)
- Разные требования к масштабированию частей
- Разные технологии нужны

**Правило:** Начинай с монолита, разделяй когда больно.

---

## 2. Bounded Context (DDD)

### Проблема

В большой системе одно слово может означать разное:

- **User** для Auth: email, password, токены
- **User** для Billing: платёжные данные, подписка
- **User** для Social: друзья, посты, лайки

Если всё в одной модели User — она станет монстром.

### Решение

Разделяем систему на контексты. Каждый контекст — своя модель, свой язык.

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Auth Context  │  │ Billing Context │  │ Social Context  │
│                 │  │                 │  │                 │
│  User:          │  │  Customer:      │  │  Profile:       │
│  - email        │  │  - userId       │  │  - userId       │
│  - passwordHash │  │  - plan         │  │  - friends      │
│  - tokens       │  │  - paymentInfo  │  │  - posts        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### В нашем проекте

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  User Context   │  │Workout Context  │  │   AI Context    │
│                 │  │                 │  │                 │
│  User:          │  │  Workout:       │  │  ParseRequest:  │
│  - telegramId   │  │  - date         │  │  - text         │
│  - username     │  │  - exercises    │  │  - userId       │
│  - createdAt    │  │  - userId (ref) │  │                 │
│                 │  │                 │  │  ParseResult:   │
│                 │  │  Exercise:      │  │  - exercises    │
│                 │  │  - name         │  │  - confidence   │
│                 │  │  - sets/reps    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Workout Context знает только `userId` — не всю модель User. Это слабая связь.

---

## 3. API Gateway Pattern

### Проблема

Клиент (бот, фронт) должен знать адреса всех сервисов:

```
Bot → http://user-service:3001/users
Bot → http://workout-service:3002/workouts
Bot → http://ai-service:3003/parse
```

**Проблемы:**
- Клиент знает внутреннюю структуру
- Добавили сервис — меняем клиент
- Аутентификация в каждом сервисе
- CORS, rate limiting везде

### Решение

Единая точка входа — Gateway:

```
Bot → http://gateway/graphql
        │
        ├─→ User Service
        ├─→ Workout Service
        └─→ AI Service
```

**Gateway делает:**
- Маршрутизация запросов
- Аутентификация (один раз)
- Rate limiting
- Агрегация данных (один запрос — данные из нескольких сервисов)
- Протокол трансляция (GraphQL снаружи, что угодно внутри)

### GraphQL Federation

Каждый сервис описывает свою часть схемы. Gateway собирает в единую схему:

```
User Service:
  type User {
    id: ID!
    username: String!
  }

Workout Service:
  type Workout {
    id: ID!
    date: Date!
    user: User!  ← ссылка на User из другого сервиса
  }

Gateway (федерация):
  type User { ... }
  type Workout { ... }
  
  Query {
    user(id: ID!): User          ← идёт в User Service
    workouts(userId: ID!): [Workout]  ← идёт в Workout Service
  }
```

---

## 4. Синхронное vs Асинхронное взаимодействие

### Синхронное (Request-Response)

Клиент ждёт ответа.

```
Bot: "Покажи профиль"
  → Gateway
    → User Service
      → Response (данные)
    ← Response
  ← Response
Bot: показывает данные
```

**Когда использовать:**
- Нужен ответ сразу
- Операция быстрая (< 1 секунды)
- Простой CRUD

**Протоколы:** HTTP, GraphQL, gRPC

### Асинхронное (Event-Driven)

Клиент не ждёт, получит ответ потом (или не получит).

```
Bot: "жим 100кг 3х10"
  → Gateway
    → RabbitMQ (ParseWorkoutCommand)
  ← "Принято, обрабатываю..."

... AI Service парсит (5 секунд)
... Workout Service сохраняет

RabbitMQ → Bot: "Тренировка сохранена!"
```

**Когда использовать:**
- Операция долгая
- Ответ не нужен сразу
- Можно обработать позже (eventual consistency)
- Нужна надёжность (если сервис упал — сообщение подождёт)

**Протоколы:** RabbitMQ, Kafka, Redis Streams

---

## 5. Event-Driven Architecture

### Events vs Commands

**Command (команда):**
- Приказ сделать что-то
- Один получатель
- Может быть отклонена
- Пример: `ParseWorkoutCommand`

**Event (событие):**
- Факт, что что-то произошло
- Много получателей (кто хочет — слушает)
- Нельзя отклонить (уже случилось)
- Пример: `WorkoutCreatedEvent`

### Пример потока

```
1. Bot отправляет Command:
   ParseWorkoutCommand { text: "жим 100кг 3х10", userId: "123" }

2. AI Service получает, парсит, отправляет Event:
   WorkoutParsedEvent { exercises: [...], userId: "123" }

3. Workout Service слушает Event, сохраняет, отправляет Event:
   WorkoutCreatedEvent { workoutId: "456", userId: "123" }

4. Bot слушает Event, уведомляет пользователя
   Notification Service слушает Event, шлёт push
   Analytics Service слушает Event, считает статистику
```

Один Event — много реакций. Сервисы не знают друг о друге.

---

## 6. Eventual Consistency

### Проблема

В монолите:

```typescript
await db.transaction(async (tx) => {
  const user = await tx.users.create({ name: 'Alex' });
  const workout = await tx.workouts.create({ userId: user.id });
  // Либо оба создались, либо ни один — ACID
});
```

В микросервисах:

```typescript
// User Service
const user = await userService.create({ name: 'Alex' });

// Workout Service (другая БД!)
const workout = await workoutService.create({ userId: user.id });
// Что если тут упало? User создан, Workout нет.
```

### Решение: Eventual Consistency

Принимаем, что данные **не всегда консистентны**, но **в итоге станут консистентными**.

```
User создан → Event: UserCreated
                ↓
           Workout Service получил
                ↓
           Теперь знает о User
```

Между событием и обработкой — окно несогласованности. Это нормально.

### Saga Pattern (упрощённо)

Цепочка локальных транзакций + компенсации при ошибке.

```
1. User Service: создать User → UserCreated
2. Workout Service: создать Workout → WorkoutCreated
3. Если (2) упало:
   → Compensation: User Service удаляет User
```

---

## 7. 12-Factor App

Методология построения cloud-native приложений. Основные принципы:

### 1. Codebase
Один репозиторий — много деплоев (dev, staging, prod).

### 2. Dependencies
Явно объявляй зависимости (package.json), не полагайся на системные.

### 3. Config
Конфигурация в переменных окружения, не в коде.

```typescript
// Плохо
const dbUrl = 'postgres://localhost:5432/db';

// Хорошо
const dbUrl = process.env.DATABASE_URL;
```

### 4. Backing Services
БД, очереди, кэш — подключаемые ресурсы. Меняются через конфиг.

### 5. Build, Release, Run
Строгое разделение этапов: сборка → релиз → запуск.

### 6. Processes
Приложение — stateless процессы. Состояние в БД/Redis, не в памяти.

### 7. Port Binding
Приложение само экспортирует HTTP (не зависит от внешнего веб-сервера).

### 8. Concurrency
Масштабирование через процессы (больше инстансов), не через потоки.

### 9. Disposability
Быстрый старт, graceful shutdown. Процесс можно убить в любой момент.

### 10. Dev/Prod Parity
Dev максимально похож на prod (Docker помогает).

### 11. Logs
Логи — поток событий в stdout. Не пишем в файлы.

### 12. Admin Processes
Разовые задачи (миграции) — те же процессы, тот же код.

---

## Ресурсы для изучения

### Статьи
- [Martin Fowler — Microservices](https://martinfowler.com/articles/microservices.html)
- [12-Factor App](https://12factor.net/ru/)
- [Microsoft — Microservices Architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices)

### Книги
- "Building Microservices" — Sam Newman
- "Domain-Driven Design" — Eric Evans (сложная, но фундаментальная)
- "Designing Data-Intensive Applications" — Martin Kleppmann

### Видео
- [Microservices на пальцах (YouTube)](https://www.youtube.com/results?search_query=microservices+explained)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)

---

## Проверочные вопросы

Ответь письменно или устно, как на собеседовании:

1. **Когда НЕ стоит использовать микросервисы?**

2. **Что такое Bounded Context? Приведи пример из нашего проекта.**

3. **Зачем нужен API Gateway? Какие проблемы он решает?**

4. **Чем Event отличается от Command? Приведи примеры.**

5. **Что такое Eventual Consistency? Почему это проблема и как с ней жить?**

6. **Сервис A сохранил данные в БД и отправил событие в RabbitMQ. RabbitMQ был недоступен. Что произойдёт? Как решить?**

7. **Пользователь отправил запрос, который проходит через 4 сервиса. Как понять где он застрял?**

8. **Что значит "stateless сервис"? Почему это важно для масштабирования?**

---

## Задание

Перед переходом к Лабе 1:

1. Прочитай архитектурный документ проекта (`tg-workout-architecture.md`)
2. Нарисуй на бумаге схему взаимодействия сервисов
3. Для каждого сервиса напиши: какие данные хранит, с кем общается, синхронно или асинхронно
4. Ответь на проверочные вопросы

---

## Ожидаемый результат

После этой лабы ты:
- Понимаешь trade-offs монолита и микросервисов
- Знаешь что такое Bounded Context и зачем делить систему
- Понимаешь роль API Gateway
- Различаешь синхронное и асинхронное взаимодействие
- Знаешь что такое Eventual Consistency и почему она неизбежна
- Можешь объяснить эти концепции на собеседовании
