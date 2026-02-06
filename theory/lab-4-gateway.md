# Лаба 4 — Gateway и оркестрация

## Цель

Создать API Gateway с GraphQL Federation, который объединяет схемы User Service и Workout Service. Настроить аутентификацию на уровне Gateway.

**Время:** 4-5 часов
**Паттерны:** API Gateway, Backend for Frontend (BFF), Schema Stitching/Federation

---

## Теория

### API Gateway Pattern

**API Gateway** — единая точка входа для всех клиентов.

**Без Gateway:**
```
Bot → User Service (auth)
Bot → Workout Service (data)
Bot → AI Service (parsing)
Mini App → User Service
Mini App → Workout Service
```

Проблемы:
- Клиент знает о всех сервисах
- Аутентификация в каждом сервисе
- Изменение адреса сервиса = изменение клиента

**С Gateway:**
```
Bot ────────┐
            ├──→ Gateway ──┬──→ User Service
Mini App ───┘              ├──→ Workout Service
                           └──→ AI Service
```

Gateway берёт на себя:
- Маршрутизация
- Аутентификация
- Rate limiting
- Логирование
- Агрегация данных

### GraphQL Federation

**Federation** — способ объединить несколько GraphQL схем в одну.

**Как работает:**

Каждый сервис — subgraph со своей схемой:
```graphql
# User Service (subgraph)
type User @key(fields: "id") {
  id: ID!
  username: String
}

# Workout Service (subgraph)  
type Workout @key(fields: "id") {
  id: ID!
  user: User!  # ← ссылка на User из другого сервиса
  date: Date!
}

extend type User @key(fields: "id") {
  id: ID! @external
  workouts: [Workout!]!  # ← расширяем User
}
```

Gateway (supergraph) объединяет:
```graphql
type User {
  id: ID!
  username: String
  workouts: [Workout!]!  # ← данные из Workout Service
}

type Workout {
  id: ID!
  user: User!  # ← данные из User Service
  date: Date!
}
```

**@key** — указывает как идентифицировать entity между сервисами.
**@external** — поле определено в другом сервисе.
**extend type** — расширяем тип из другого сервиса.

### Schema Stitching vs Federation

**Schema Stitching (старый подход):**
- Gateway сам объединяет схемы
- Вся логика в Gateway
- Сложно масштабировать

**Federation (Apollo):**
- Сервисы знают как их данные связаны
- Gateway только маршрутизирует
- Легче масштабировать

Мы используем **Federation** через Apollo Gateway.

### Backend for Frontend (BFF)

**BFF** — Gateway, оптимизированный под конкретный клиент.

**Пример:**
- Mobile BFF — минимум данных, оптимизация трафика
- Web BFF — больше данных, меньше запросов
- Bot BFF — специфичные операции для бота

В нашем случае один Gateway, но можно добавить специфичную логику для бота.

### Аутентификация в Gateway

**Стратегия:**

1. Клиент отправляет токен (JWT или Telegram initData)
2. Gateway валидирует токен
3. Gateway добавляет user info в контекст
4. Subgraph получает user info через headers

```
Client → [JWT] → Gateway → [X-User-Id: 123] → User Service
```

Gateway не передаёт JWT в subgraphs — только проверенные данные.

---

## Ресурсы

- [Apollo Federation](https://www.apollographql.com/docs/federation/)
- [NestJS GraphQL Federation](https://docs.nestjs.com/graphql/federation)
- [Apollo Gateway](https://www.apollographql.com/docs/apollo-server/using-federation/apollo-gateway-setup)

---

## Задачи

### Задача 4.1: Подготовка Subgraphs

Обнови User Service и Workout Service для поддержки Federation.

**User Service:**

Установи:
```bash
npm install @apollo/subgraph
```

Обнови User entity:
- Добавь `@Directive('@key(fields: "id")')` 

Настрой GraphQL модуль как subgraph:
```typescript
GraphQLModule.forRoot<ApolloFederationDriverConfig>({
  driver: ApolloFederationDriver,
  autoSchemaFile: { federation: 2 },
})
```

**Workout Service:**

То же самое + расширение User:

```typescript
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Field(() => [Workout])
  workouts: Workout[];
}
```

Добавь resolver для User.workouts:
```typescript
@ResolveField(() => [Workout])
async workouts(@Parent() user: User) {
  return this.workoutQueryService.getUserWorkouts(user.id);
}
```

---

### Задача 4.2: Настройка Gateway

Создай Gateway в `apps/gateway`:

Установи:
```bash
npm install @apollo/gateway @apollo/server @nestjs/apollo
```

Настрой Apollo Gateway:

```typescript
// app.module.ts
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:3001/graphql' },
            { name: 'workouts', url: 'http://localhost:3002/graphql' },
          ],
        }),
      },
    }),
  ],
})
```

---

### Задача 4.3: Конфигурация через env

Вынеси URL subgraphs в переменные окружения:

```env
USER_SERVICE_URL=http://localhost:3001/graphql
WORKOUT_SERVICE_URL=http://localhost:3002/graphql
```

Создай ConfigService для Gateway.

---

### Задача 4.4: Аутентификация — JWT Guard

Создай `JwtAuthGuard` для Gateway:

Логика:
1. Извлечь токен из заголовка Authorization
2. Верифицировать JWT
3. Добавить user в контекст GraphQL

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    const token = this.extractToken(request);
    if (!token) return false;
    
    const payload = this.jwtService.verify(token);
    request.user = payload;
    
    return true;
  }
}
```

---

### Задача 4.5: Аутентификация — Telegram initData

Создай `TelegramAuthGuard`:

Логика:
1. Извлечь initData из заголовка X-Telegram-Init-Data
2. Валидировать подпись Telegram
3. Извлечь user данные
4. Найти или создать пользователя в User Service
5. Добавить user в контекст

Валидация initData:
```typescript
function validateTelegramInitData(initData: string, botToken: string): boolean {
  // 1. Распарсить initData как URLSearchParams
  // 2. Извлечь hash
  // 3. Отсортировать остальные параметры
  // 4. Создать data_check_string
  // 5. Вычислить HMAC-SHA256
  // 6. Сравнить с hash
}
```

---

### Задача 4.6: Передача контекста в Subgraphs

Настрой Gateway чтобы передавать user info в subgraphs через headers.

```typescript
GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
  driver: ApolloGatewayDriver,
  gateway: {
    // ...
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          if (context.user) {
            request.http.headers.set('x-user-id', context.user.id);
            request.http.headers.set('x-user-telegram-id', context.user.telegramId);
          }
          if (context.correlationId) {
            request.http.headers.set('x-correlation-id', context.correlationId);
          }
        },
      });
    },
  },
})
```

---

### Задача 4.7: Извлечение user в Subgraphs

Обнови User Service и Workout Service:

Создай middleware/guard который извлекает user из headers:

```typescript
@Injectable()
export class UserFromHeadersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    const userId = request.headers['x-user-id'];
    if (userId) {
      request.user = { id: userId };
    }
    
    return true;
  }
}
```

Создай декоратор `@CurrentUser()`:
```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    return context.getContext().req.user;
  },
);
```

---

### Задача 4.8: Correlation ID

Реализуй передачу Correlation ID через все сервисы:

1. Gateway генерирует ID если его нет в запросе
2. Передаёт в subgraphs через header
3. Subgraphs используют в логах

Создай middleware для Gateway:
```typescript
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
    req['correlationId'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  }
}
```

Добавь в GraphQL контекст.

---

### Задача 4.9: Health Checks

Добавь health endpoint в Gateway:

```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      subgraphs: {
        users: await this.checkSubgraph('http://localhost:3001/health'),
        workouts: await this.checkSubgraph('http://localhost:3002/health'),
      },
    };
  }
}
```

Добавь health endpoints в subgraphs.

---

### Задача 4.10: Error Handling

Создай глобальный exception filter для Gateway:

Требования:
- Логировать ошибки с correlation ID
- Не выставлять внутренние детали наружу
- Форматировать ошибки в GraphQL формат

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const correlationId = // извлечь из контекста
    
    this.logger.error({
      correlationId,
      error: exception,
    });
    
    // Вернуть безопасную ошибку клиенту
  }
}
```

---

### Задача 4.11: Rate Limiting

Добавь rate limiting для Gateway:

Установи:
```bash
npm install @nestjs/throttler
```

Настрой:
- 100 запросов в минуту для обычных пользователей
- По IP или по user ID

```typescript
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
})
```

Создай Guard для GraphQL:
```typescript
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return { req: ctx.getContext().req, res: ctx.getContext().res };
  }
}
```

---

### Задача 4.12: Тестирование Federation

Проверь что Federation работает:

1. Запусти все сервисы
2. Открой Gateway GraphQL Playground
3. Выполни query который использует данные из обоих сервисов:

```graphql
query {
  user(id: "...") {
    id
    username
    workouts {
      id
      date
      exercises {
        name
        sets
        reps
      }
    }
  }
}
```

Данные должны прийти из обоих сервисов прозрачно.

---

## Ожидаемый результат

После выполнения:

1. **Gateway** объединяет схемы User и Workout сервисов
2. **Federation** работает — можно запросить user.workouts
3. **JWT аутентификация** проверяется на Gateway
4. **Telegram initData** валидируется
5. **Correlation ID** передаётся во все сервисы
6. **Health checks** показывают статус subgraphs
7. **Rate limiting** ограничивает запросы

---

## Проверочные вопросы

1. Зачем нужен API Gateway если клиент может ходить в сервисы напрямую?
2. Чем Federation отличается от Schema Stitching?
3. Почему аутентификация на Gateway, а не в каждом сервисе?
4. Как Gateway узнаёт куда направить часть запроса?
5. Что такое @key directive в Federation?
6. Зачем Correlation ID?

---

## Чеклист завершения

- [ ] Gateway запускается и показывает объединённую схему
- [ ] Query с данными из двух сервисов работает
- [ ] JWT аутентификация работает
- [ ] Telegram initData валидация работает
- [ ] Correlation ID передаётся в логах
- [ ] Health endpoint возвращает статус subgraphs
- [ ] Rate limiting работает
