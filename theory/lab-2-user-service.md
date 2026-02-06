# Лаба 2 — User Service + TypeORM

## Цель

Создать полноценный микросервис для управления пользователями с TypeORM, миграциями, паттернами Repository и DTO. Настроить GraphQL API.

**Время:** 5-6 часов
**Паттерны:** Repository, Unit of Work, DTO, Entity, Value Object, Dependency Injection

---

## Теория

### Entity

**Entity** — объект с уникальной идентичностью. Два entity с одинаковыми данными, но разными id — разные объекты.

**Характеристики:**
- Имеет уникальный идентификатор (id)
- Изменяемый (mutable)
- Равенство по id, не по значениям полей

**Пример:** User — даже если два пользователя с одинаковым именем, они разные (разные id).

### Value Object

**Value Object** — объект без идентичности. Равенство по значениям.

**Характеристики:**
- Нет id
- Неизменяемый (immutable)
- Равенство по всем полям

**Примеры:**
- Email — два Email с одинаковым значением равны
- Money(100, 'USD') — два объекта с одинаковыми значениями равны
- DateRange(start, end)

**Зачем:**
- Валидация в одном месте (Email всегда валидный)
- Самодокументируемый код (тип Email вместо string)

### Repository Pattern

**Repository** — абстракция над хранилищем данных. Скрывает детали работы с БД.

**Зачем:**
- Бизнес-логика не знает про SQL/ORM
- Легко заменить хранилище (PostgreSQL → MongoDB)
- Легко мокать для тестов

**Интерфейс:**
```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByTelegramId(telegramId: number): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}
```

**Реализация знает про TypeORM**, интерфейс — нет.

### Unit of Work

**Unit of Work** — отслеживает изменения и сохраняет их в одной транзакции.

TypeORM EntityManager реализует этот паттерн:
- Отслеживает изменённые entity
- `save()` сохраняет все изменения
- Транзакции через `transaction()`

### DTO (Data Transfer Object)

**DTO** — объект для передачи данных между слоями.

**Зачем:**
- Не выставляем Entity наружу (безопасность)
- Валидация входящих данных
- Разные представления для разных случаев

**Типы:**
- `CreateUserDto` — данные для создания
- `UpdateUserDto` — данные для обновления (частичные)
- `UserResponseDto` — данные для ответа клиенту

### Миграции

**Миграция** — версионированное изменение схемы БД.

**Зачем:**
- История изменений схемы
- Воспроизводимость на разных окружениях
- Откат изменений (down migration)

**Правило:** Никогда не меняй схему напрямую. Только через миграции.

### GraphQL в NestJS

**Resolver** — аналог Controller для GraphQL.

**Query** — получение данных (GET).
**Mutation** — изменение данных (POST/PUT/DELETE).

**Code-First подход:**
- Описываем типы в TypeScript с декораторами
- NestJS генерирует GraphQL схему автоматически

---

## Ресурсы

- [TypeORM Documentation](https://typeorm.io/)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [class-validator](https://github.com/typestack/class-validator)

---

## Задачи

### Задача 2.1: Инициализация User Service

Создай NestJS проект в `apps/user-service`:

```
apps/user-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── user/
│   │   └── ...
│   └── auth/
│       └── ...
├── package.json
└── tsconfig.json
```

Установи зависимости:
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- @nestjs/graphql, @nestjs/apollo, apollo-server-express, graphql
- @nestjs/typeorm, typeorm, pg
- class-validator, class-transformer
- @nestjs/jwt, @nestjs/passport, passport, passport-jwt

---

### Задача 2.2: Конфигурация TypeORM

Настрой подключение к PostgreSQL:

Требования:
- Читай параметры из переменных окружения
- Используй ConfigModule из @nestjs/config
- Включи автозагрузку entities
- Логирование SQL в dev режиме
- **synchronize: false** — только миграции!

---

### Задача 2.3: Entity User

Создай entity `User`:

Поля:
- id — UUID, primary key, генерируется автоматически
- telegramId — bigint, уникальный, обязательный
- username — string, nullable
- firstName — string, nullable
- lastName — string, nullable
- createdAt — timestamp, автоматически
- updatedAt — timestamp, автоматически при изменении

Используй декораторы TypeORM и GraphQL (@ObjectType, @Field).

---

### Задача 2.4: Value Object TelegramId

Создай Value Object для telegramId:

Требования:
- Валидация: положительное число
- Метод equals() для сравнения
- Геттер value для получения числа

Используй в entity через @Column с transformer.

---

### Задача 2.5: Repository

Создай интерфейс `IUserRepository` в user/interfaces/.

Методы:
- findById(id: string): Promise<User | null>
- findByTelegramId(telegramId: number): Promise<User | null>
- findAll(): Promise<User[]>
- save(user: User): Promise<User>
- delete(id: string): Promise<boolean>

Создай реализацию `UserRepository` используя TypeORM Repository.

Зарегистрируй через custom provider:
```typescript
{
  provide: 'IUserRepository',
  useClass: UserRepository,
}
```

---

### Задача 2.6: DTO

Создай DTO в user/dto/:

**CreateUserDto:**
- telegramId — обязательный, число, положительное
- username — опциональный, строка
- firstName — опциональный, строка
- lastName — опциональный, строка

**UpdateUserDto:**
- Все поля опциональные (используй PartialType)

**UserResponseDto:**
- id, telegramId, username, firstName, lastName, createdAt

Добавь валидацию через class-validator (@IsNumber, @IsOptional, @IsString, @IsPositive).

---

### Задача 2.7: User Service

Создай `UserService`:

Зависимости (через DI):
- IUserRepository

Методы:
- createUser(dto: CreateUserDto): Promise<User>
- findById(id: string): Promise<User>
- findByTelegramId(telegramId: number): Promise<User>
- updateUser(id: string, dto: UpdateUserDto): Promise<User>
- deleteUser(id: string): Promise<boolean>
- findOrCreate(dto: CreateUserDto): Promise<User> — найти по telegramId или создать

Обработка ошибок:
- Не найден → NotFoundException
- Дубликат telegramId → ConflictException

---

### Задача 2.8: GraphQL Resolver

Создай `UserResolver`:

Queries:
- user(id: ID!): User
- userByTelegramId(telegramId: Int!): User
- users: [User!]!

Mutations:
- createUser(input: CreateUserInput!): User!
- updateUser(id: ID!, input: UpdateUserInput!): User!
- deleteUser(id: ID!): Boolean!

Создай Input типы для GraphQL (CreateUserInput, UpdateUserInput).

---

### Задача 2.9: Миграции

Настрой TypeORM CLI для миграций:

Добавь в package.json скрипты:
- migration:generate — генерация миграции из изменений entity
- migration:run — применение миграций
- migration:revert — откат последней миграции

Создай первую миграцию для таблицы users.

Запусти миграцию и проверь что таблица создана.

---

### Задача 2.10: Inbox/Outbox таблицы

Создай entity для Inbox и Outbox (используй из packages/database).

Создай миграцию для таблиц inbox_messages и outbox_messages.

Структура inbox_messages:
- id — UUID
- messageId — string, unique (для идемпотентности)
- messageType — string
- payload — jsonb
- processedAt — timestamp, nullable
- createdAt — timestamp

Структура outbox_messages:
- id — UUID
- eventType — string
- payload — jsonb
- sentAt — timestamp, nullable
- createdAt — timestamp

---

### Задача 2.11: Auth — JWT

Создай модуль аутентификации:

**AuthService:**
- validateTelegramInitData(initData: string): Promise<TelegramUser>
- generateToken(user: User): string
- verifyToken(token: string): JwtPayload

**JwtStrategy** (Passport):
- Извлекает user из токена
- Добавляет в request.user

**JwtAuthGuard:**
- Защита resolver'ов

---

### Задача 2.12: Тестирование

Напиши unit-тесты для UserService:

Тесты:
- createUser — успешное создание
- createUser — дубликат telegramId → ошибка
- findById — найден
- findById — не найден → ошибка
- findOrCreate — существующий пользователь
- findOrCreate — новый пользователь

Используй моки для IUserRepository.

---

## Ожидаемый результат

После выполнения:

1. **User Service** запускается на порту 3001
2. **GraphQL Playground** доступен на /graphql
3. **Миграции** применяются командой npm run migration:run
4. **CRUD операции** работают через GraphQL
5. **JWT аутентификация** работает
6. **Inbox/Outbox таблицы** созданы
7. **Тесты** проходят

---

## Проверочные вопросы

1. Чем Entity отличается от Value Object?
2. Зачем нужен Repository если есть TypeORM Repository?
3. Почему synchronize: false в production?
4. Что такое DTO и зачем их три разных типа?
5. Как работает Dependency Injection в NestJS?
6. Зачем Inbox/Outbox таблицы в этом сервисе?

---

## Чеклист завершения

- [ ] User Service запускается без ошибок
- [ ] GraphQL Playground работает
- [ ] Query users возвращает список
- [ ] Mutation createUser создаёт пользователя
- [ ] Миграции применяются и откатываются
- [ ] JWT токен генерируется и валидируется
- [ ] Unit-тесты проходят
- [ ] Inbox/Outbox таблицы созданы
