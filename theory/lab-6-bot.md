# Лаба 6 — Telegram Bot

## Цель

Создать Telegram бота как точку входа в систему. Реализовать сцены диалога, интеграцию с Gateway через GraphQL, обработку webhook.

**Время:** 4-5 часов
**Паттерны:** Adapter, Command, State Machine (Scenes)

---

## Теория

### Adapter Pattern

**Adapter** — преобразует интерфейс одной системы в интерфейс другой.

В нашем случае бот — адаптер между Telegram API и нашей системой:

```
Telegram API (updates, messages)
        │
        ▼
    Bot (Adapter)
        │
        ▼
    Gateway (GraphQL)
```

Бот преобразует:
- Telegram update → GraphQL mutation
- GraphQL response → Telegram message

### Command Pattern

**Command** — инкапсулирует запрос как объект.

Каждая команда бота (`/start`, `/workout`, `/stats`) — отдельный объект с методом execute.

### State Machine (Scenes)

**Scene** — состояние диалога с пользователем.

**Проблема:** Пользователь отправляет "100" — это вес? Подходы? Повторения?

**Решение:** Сцены отслеживают контекст диалога.

### Grammy vs Telegraf

Мы используем **Grammy** — более современный подход с хорошей типизацией.

### Webhook vs Polling

**Polling** — бот постоянно спрашивает Telegram "есть обновления?"
**Webhook** — Telegram сам присылает обновления боту

Webhook эффективнее для production.

---

## Ресурсы

- [Grammy Documentation](https://grammy.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Grammy Conversations](https://grammy.dev/plugins/conversations.html)

---

## Задачи

### Задача 6.1: Инициализация Bot

Создай `apps/bot`:

```
apps/bot/
├── src/
│   ├── main.ts
│   ├── bot.ts
│   ├── commands/
│   │   ├── start.command.ts
│   │   ├── workout.command.ts
│   │   ├── stats.command.ts
│   │   └── help.command.ts
│   ├── conversations/
│   │   └── add-workout.conversation.ts
│   ├── services/
│   │   ├── gateway.service.ts
│   │   └── auth.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── logging.middleware.ts
│   └── types/
│       └── context.ts
├── package.json
└── tsconfig.json
```

Установи:
```bash
npm install grammy @grammyjs/conversations
npm install graphql-request graphql
```

---

### Задача 6.2: Конфигурация бота

Создай основной файл бота с типизированным контекстом, session storage, middleware.

---

### Задача 6.3: Gateway Service

Создай `GatewayService` для связи с Gateway через GraphQL:

Методы:
- authenticate(telegramUser): Promise<AuthResult>
- getUser(userId): Promise<User>
- createWorkout(input): Promise<Workout>
- getUserWorkouts(userId): Promise<Workout[]>
- getStats(userId): Promise<WorkoutStats>
- parseWorkout(text, userId): Promise<ParseResult>

---

### Задача 6.4: Auth Middleware

Создай middleware который:
1. Извлекает Telegram user из update
2. Аутентифицирует через Gateway (findOrCreate)
3. Сохраняет userId и token в session

---

### Задача 6.5: Logging Middleware

Создай middleware который логирует:
- Тип update
- User ID
- Текст сообщения
- Время обработки
- Correlation ID

---

### Задача 6.6: Command — /start

Приветствие пользователя с inline keyboard основных действий.

---

### Задача 6.7: Command — /help

Инструкция по использованию бота с примерами записи тренировок.

---

### Задача 6.8: Command — /stats

Запрос статистики через Gateway и форматирование ответа.

---

### Задача 6.9: Conversation — Add Workout

Создай conversation для добавления тренировки:
1. Пользователь пишет текст
2. AI парсит
3. Показываем результат с кнопками подтверждения

---

### Задача 6.10: Callback Query Handler

Обработка inline кнопок:
- confirm_workout — сохранить
- edit_workout — редактировать  
- cancel_workout — отменить

---

### Задача 6.11: History Command

Показ последних тренировок с pagination.

---

### Задача 6.12: Обработка произвольного текста

Если пользователь пишет текст (не команду) — парсим как тренировку.

---

### Задача 6.13: Error Handler

Глобальный обработчик ошибок с логированием и дружелюбным сообщением пользователю.

---

### Задача 6.14: Webhook Setup

Настройка webhook для production, polling для development.

---

### Задача 6.15: Health Endpoint

Endpoint /health для проверки состояния бота.

---

## Ожидаемый результат

1. **Бот** запускается и отвечает на команды
2. **/start** показывает приветствие
3. **/workout** запускает добавление тренировки
4. **/stats** показывает статистику
5. **Произвольный текст** парсится как тренировка
6. **Inline кнопки** работают

---

## Проверочные вопросы

1. Почему бот — это Adapter pattern?
2. Зачем нужны Scenes/Conversations?
3. Чем Webhook лучше Polling?
4. Как бот аутентифицирует пользователя?
5. Как масштабировать бота (несколько инстансов)?

---

## Чеклист завершения

- [ ] Бот запускается
- [ ] /start работает
- [ ] /workout работает
- [ ] /stats работает
- [ ] Inline кнопки работают
- [ ] Ошибки логируются
