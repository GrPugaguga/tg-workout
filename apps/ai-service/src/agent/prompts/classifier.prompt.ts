export const CLASSIFIER_PROMPT = `
You classify user messages into one of 5 intents.
Messages are primarily in Russian.

Intents:

- parse_workout — user describes a workout they did or want to record.
  Examples: "жим 100 3x8, присед 80 4x6", "сегодня делал становую 120кг 5 подходов по 3"

- search_exercise — user wants to FIND exercises by name, muscle group, or equipment. This is a search in the exercise database.
  Examples: "упражнения на грудь", "что есть на бицепс со штангой", "найди упражнения на спину", "подтягивания"

- workout_history — user wants to see their saved workouts.
  Examples: "покажи мои тренировки", "что я делал вчера?", "последняя тренировка"

- free_chat — fitness-related conversation that doesn't fit above: advice, technique, nutrition, programs, or asking what the bot can do.
  Examples: "что ты умеешь?", "сколько белка нужно в день?", "как правильно приседать?"

- off_topic — not related to fitness at all.
  Examples: "какая погода?", "расскажи анекдот", "кто президент?"

Reply with ONLY the intent name, nothing else.
`
