# Ideas & Future Improvements (v2+)

## 1. Chat Service (выделить из ai-service)

Сейчас ai-service совмещает роль оркестратора (classifier + routing) и чат-функции (free_chat, off_topic).
В будущем вынести чат-логику в отдельный `chat-service`:

- Отдельная БД (PostgreSQL) для хранения истории сообщений
- Таблица `conversations` (userId, createdAt) + `messages` (conversationId, role, content, timestamp)
- RabbitMQ хандлеры: `chat.send`, `chat.history`
- Контекстное окно: передавать последние N сообщений в LLM
- Streaming ответов (SSE или WebSocket через Gateway)
- RAG: поиск по базе знаний о фитнесе для более точных ответов

ai-service остается чистым оркестратором: classify -> route -> return.

## 2. Re-parse / Коррекция тренировки

Сценарий: пользователь отправил "жим 100 3x8", получил результат, потом пишет "замени жим на присед".

Что нужно:
- Новый intent `correct_workout` в classifier
- Хранить предыдущий ParsedWorkoutResult в контексте (bot-service conversation state)
- Передавать history + предыдущий результат в parsing-service
- parsing-service.dto уже поддерживает `history?: AiMessage[]`

Логичнее реализовать на уровне bot-service (conversation state), а не в ai-service.

## 3. "Живые" ответы вместо захардкоженных

Сейчас каждый tool формирует текст ответа сам (шаблонные строки).
Можно добавить финальный LLM вызов в handleMessage:

```
tool result -> LLM("сформируй ответ пользователю на основе данных") -> message
```

Плюс: ответы естественнее, учитывают контекст вопроса.
Минус: +1 LLM вызов на каждый запрос (стоимость, задержка).

## 4. Аналитика тренировок

Новый intent `workout_analytics`:
- "какой прогресс в жиме за месяц?"
- "сколько тренировок на этой неделе?"

Нужно: workout-service RabbitMQ handler для агрегированных данных (группировка по дням, прогресс по упражнению).
LLM интерпретирует данные и генерирует текстовый ответ.

## 5. Генерация программ тренировок

Новый intent `generate_program`:
- "составь программу на массу 3 дня в неделю"

Чистый LLM вызов с system prompt, учитывающим историю тренировок пользователя.

## 6. Оркестратор -> ReAct Agent

Когда intents станет больше 6-7, классификатор начнет путаться.
Перейти на ReAct паттерн: LLM сам решает какие tools вызывать, может комбинировать несколько.
Например: "покажи мои тренировки за неделю и дай совет" = workout_history + free_chat.
