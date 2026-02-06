# Лаба 3 — Workout Service + GraphQL

## Цель

Создать сервис тренировок с более сложной доменной моделью, связями между entity, и применить базовые концепции CQRS и Domain Events.

**Время:** 5-6 часов
**Паттерны:** CQRS (базово), Aggregate Root, Domain Events, Repository

---

## Теория

### Aggregate и Aggregate Root

**Aggregate** — кластер связанных объектов, которые рассматриваются как единое целое.

**Aggregate Root** — точка входа в Aggregate. Внешний код работает только через Root.

**Пример:**
```
Workout (Aggregate Root)
├── WorkoutExercise
├── WorkoutExercise
└── WorkoutExercise
```

**Правила:**
- Внешний код обращается только к Workout, не к WorkoutExercise напрямую
- Workout контролирует инварианты (бизнес-правила) для всего Aggregate
- Сохранение/удаление — через Root (каскадно)

**Зачем:**
- Гарантия консистентности внутри Aggregate
- Упрощение транзакций (один Aggregate = одна транзакция)
- Чёткие границы

### Domain Events

**Domain Event** — запись о том, что что-то важное произошло в домене.

**Характеристики:**
- Именуется в прошедшем времени (WorkoutCreated, ExerciseAdded)
- Неизменяемый
- Содержит данные о событии

**Зачем:**
- Слабая связь между частями системы
- Аудит (история изменений)
- Реакция других сервисов

**Пример:**
```typescript
class WorkoutCreatedEvent {
  constructor(
    public readonly workoutId: string,
    public readonly userId: string,
    public readonly date: Date,
    public readonly exercises: Exercise[],
    public readonly occurredAt: Date = new Date()
  ) {}
}
```

### CQRS (Command Query Responsibility Segregation)

**Идея:** Разделить операции чтения (Query) и записи (Command).

**Зачем:**
- Оптимизация чтения отдельно от записи
- Разные модели для чтения и записи
- Масштабирование чтения отдельно

**Базовый CQRS (наш случай):**
- Query — простые методы чтения, могут использовать оптимизированные запросы
- Command — методы изменения, работают через Aggregate Root

**Продвинутый CQRS:**
- Отдельные базы для чтения и записи
- Event Sourcing

Мы применим базовый — разделение на уровне сервиса.

### Relations в TypeORM

**OneToMany / ManyToOne:**
```typescript
// Workout имеет много WorkoutExercise
@OneToMany(() => WorkoutExercise, (we) => we.workout)
exercises: WorkoutExercise[];

// WorkoutExercise принадлежит одному Workout
@ManyToOne(() => Workout, (w) => w.exercises)
workout: Workout;
```

**Cascade:**
```typescript
@OneToMany(() => WorkoutExercise, (we) => we.workout, {
  cascade: true,  // сохранение/удаление каскадом
  eager: false,   // не загружать автоматически
})
```

**Eager vs Lazy Loading:**
- Eager: загружает связи сразу (может быть медленно)
- Lazy: загружает по требованию (нужны Promise)
- Лучше: явно указывать relations при запросе

---

## Ресурсы

- [TypeORM Relations](https://typeorm.io/relations)
- [DDD Aggregate](https://martinfowler.com/bliki/DDD_Aggregate.html)
- [CQRS Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

---

## Задачи

### Задача 3.1: Инициализация Workout Service

Создай NestJS проект в `apps/workout-service`:

Структура:
```
apps/workout-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── exercise/          # Справочник упражнений
│   │   ├── exercise.module.ts
│   │   ├── exercise.service.ts
│   │   ├── exercise.resolver.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── repositories/
│   ├── workout/           # Тренировки
│   │   ├── workout.module.ts
│   │   ├── workout.service.ts
│   │   ├── workout.resolver.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── repositories/
│   │   └── events/
│   └── shared/
│       └── ...
├── package.json
└── tsconfig.json
```

Те же зависимости что и User Service + TypeORM, GraphQL.

---

### Задача 3.2: Entity Exercise (справочник)

Создай entity `Exercise` — справочник упражнений:

Поля:
- id — UUID
- name — string, уникальный
- aliases — string[] (альтернативные названия: "жим лёжа", "bench press")
- muscleGroup — enum (chest, back, legs, shoulders, arms, core)
- equipment — enum (barbell, dumbbell, machine, bodyweight, cable)
- createdAt, updatedAt

Это НЕ Aggregate Root — простой справочник.

---

### Задача 3.3: Entity Workout (Aggregate Root)

Создай entity `Workout`:

Поля:
- id — UUID
- odawuderId — UUID (ссылка на User из другого сервиса)
- date — date
- notes — string, nullable
- exercises — OneToMany к WorkoutExercise
- createdAt, updatedAt

Методы (бизнес-логика в Entity):
- addExercise(exercise: Exercise, sets: number, reps: number, weight: number)
- removeExercise(workoutExerciseId: string)
- updateExercise(workoutExerciseId: string, data: Partial<WorkoutExerciseData>)
- getTotalVolume(): number — сумма (sets * reps * weight) всех упражнений

---

### Задача 3.4: Entity WorkoutExercise

Создай entity `WorkoutExercise`:

Поля:
- id — UUID
- workout — ManyToOne к Workout
- exercise — ManyToOne к Exercise (справочник)
- sets — number
- reps — number
- weight — number (в кг)
- orderIndex — number (порядок в тренировке)
- notes — string, nullable

Настрой cascade: true на связи Workout → WorkoutExercise.

---

### Задача 3.5: Repository для Exercise

Создай `IExerciseRepository` и `ExerciseRepository`:

Методы:
- findById(id: string): Promise<Exercise | null>
- findByName(name: string): Promise<Exercise | null>
- findByAlias(alias: string): Promise<Exercise | null>
- search(query: string): Promise<Exercise[]> — поиск по name и aliases
- findAll(): Promise<Exercise[]>
- save(exercise: Exercise): Promise<Exercise>

Метод search должен использовать ILIKE для case-insensitive поиска.

---

### Задача 3.6: Repository для Workout

Создай `IWorkoutRepository` и `WorkoutRepository`:

Методы:
- findById(id: string): Promise<Workout | null>
- findByUserId(userId: string, options?: { skip?: number, take?: number }): Promise<Workout[]>
- findByUserIdAndDate(userId: string, date: Date): Promise<Workout | null>
- save(workout: Workout): Promise<Workout>
- delete(id: string): Promise<boolean>

При загрузке Workout всегда подгружай exercises с exercise (справочник):
```typescript
relations: ['exercises', 'exercises.exercise']
```

---

### Задача 3.7: Domain Events

Создай события в workout/events/:

**WorkoutCreatedEvent:**
- workoutId
- userId
- date
- exercises (массив с названиями, sets, reps, weight)
- createdAt

**WorkoutUpdatedEvent:**
- workoutId
- userId
- changes (что изменилось)
- updatedAt

**WorkoutDeletedEvent:**
- workoutId
- userId
- deletedAt

Создай `EventBus` — простой класс для публикации событий (in-memory для начала):

```typescript
class EventBus {
  private handlers = new Map<string, Function[]>();
  
  subscribe(eventType: string, handler: Function): void;
  publish(event: DomainEvent): void;
}
```

---

### Задача 3.8: Workout Service (Commands)

Создай `WorkoutCommandService` для операций записи:

Методы:
- createWorkout(userId: string, dto: CreateWorkoutDto): Promise<Workout>
- addExerciseToWorkout(workoutId: string, dto: AddExerciseDto): Promise<Workout>
- updateWorkoutExercise(workoutId: string, exerciseId: string, dto: UpdateExerciseDto): Promise<Workout>
- removeExerciseFromWorkout(workoutId: string, exerciseId: string): Promise<Workout>
- deleteWorkout(workoutId: string): Promise<boolean>

Каждый метод должен:
1. Загрузить Aggregate (Workout)
2. Вызвать метод Aggregate
3. Сохранить
4. Опубликовать Domain Event

---

### Задача 3.9: Workout Service (Queries)

Создай `WorkoutQueryService` для операций чтения:

Методы:
- getWorkout(id: string): Promise<Workout>
- getUserWorkouts(userId: string, pagination: PaginationDto): Promise<PaginatedResult<Workout>>
- getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>
- getWorkoutStats(userId: string): Promise<WorkoutStats>

**WorkoutStats:**
- totalWorkouts
- totalExercises
- totalVolume
- favoriteExercise (самое частое)
- lastWorkoutDate

Query Service может делать оптимизированные запросы, не обязательно через Aggregate.

---

### Задача 3.10: DTO

Создай DTO:

**CreateWorkoutDto:**
- date — Date, обязательный
- notes — string, опциональный
- exercises — массив:
  - exerciseId — UUID
  - sets, reps, weight — numbers

**AddExerciseDto:**
- exerciseId — UUID
- sets, reps, weight — numbers
- notes — string, опциональный

**UpdateExerciseDto:**
- sets, reps, weight — все опциональные
- notes — опциональный

**PaginationDto:**
- skip — number, default 0
- take — number, default 20, max 100

---

### Задача 3.11: GraphQL Resolver

Создай `WorkoutResolver`:

Queries:
- workout(id: ID!): Workout
- myWorkouts(pagination: PaginationInput): PaginatedWorkouts
- workoutStats: WorkoutStats

Mutations:
- createWorkout(input: CreateWorkoutInput!): Workout!
- addExercise(workoutId: ID!, input: AddExerciseInput!): Workout!
- updateExercise(workoutId: ID!, exerciseId: ID!, input: UpdateExerciseInput!): Workout!
- removeExercise(workoutId: ID!, exerciseId: ID!): Workout!
- deleteWorkout(id: ID!): Boolean!

Создай `ExerciseResolver`:

Queries:
- exercise(id: ID!): Exercise
- exercises: [Exercise!]!
- searchExercises(query: String!): [Exercise!]!

---

### Задача 3.12: Seed данные для упражнений

Создай seed скрипт для заполнения справочника упражнений:

Базовые упражнения:
- Жим лёжа (aliases: bench press, жим штанги лёжа) — chest, barbell
- Приседания (aliases: squat, присед) — legs, barbell
- Становая тяга (aliases: deadlift, тяга) — back, barbell
- Подтягивания (aliases: pull-ups, подтяги) — back, bodyweight
- Жим стоя (aliases: overhead press, армейский жим) — shoulders, barbell
- Тяга штанги в наклоне (aliases: barbell row) — back, barbell
- Отжимания (aliases: push-ups) — chest, bodyweight
- Жим гантелей (aliases: dumbbell press) — chest, dumbbell
- Бицепс со штангой (aliases: barbell curl) — arms, barbell
- Французский жим (aliases: skull crusher) — arms, barbell

Добавь ещё 10-15 упражнений на своё усмотрение.

---

### Задача 3.13: Миграции

Создай миграции для:
- exercises (справочник)
- workouts
- workout_exercises
- inbox_messages
- outbox_messages

Проверь что связи (foreign keys) созданы корректно.

---

## Ожидаемый результат

После выполнения:

1. **Workout Service** запускается на порту 3002
2. **Справочник упражнений** заполнен seed данными
3. **CRUD тренировок** работает через GraphQL
4. **Aggregate Root** (Workout) контролирует бизнес-логику
5. **Domain Events** публикуются при изменениях
6. **Queries и Commands** разделены
7. **Pagination** работает для списка тренировок

---

## Проверочные вопросы

1. Почему Workout — Aggregate Root, а WorkoutExercise — нет?
2. Зачем бизнес-логика в Entity, а не в Service?
3. Чем отличается Command от Query в нашей реализации?
4. Зачем Domain Events если мы ещё не интегрировали RabbitMQ?
5. Почему cascade: true на связи Workout → WorkoutExercise?
6. Как изменится архитектура если нужно хранить историю изменений тренировки?

---

## Чеклист завершения

- [ ] Workout Service запускается
- [ ] Справочник упражнений доступен через GraphQL
- [ ] Создание тренировки работает
- [ ] Добавление/удаление упражнений работает
- [ ] Статистика возвращает корректные данные
- [ ] Pagination работает
- [ ] Domain Events публикуются (проверь логами)
- [ ] Миграции применяются без ошибок
