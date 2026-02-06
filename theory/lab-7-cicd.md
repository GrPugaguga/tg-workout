# Лаба 7 — CI/CD и Deploy

## Цель

Настроить полный pipeline от коммита до production: CI с тестами, сборка Docker образов, деплой на VPS. Реализовать graceful shutdown, health checks, горизонтальное масштабирование.

**Время:** 4-5 часов
**Паттерны:** Graceful Shutdown, Health Checks, Horizontal Scaling, Infrastructure as Code

---

## Теория

### CI/CD Pipeline

**CI (Continuous Integration):**
- Автоматическая сборка при каждом коммите
- Запуск тестов
- Линтинг, проверка типов
- Сборка артефактов

**CD (Continuous Deployment):**
- Автоматический деплой в staging/production
- Blue-green или rolling deployment
- Откат при ошибках

### Docker Multi-stage Build

**Проблема:** Node.js образ с dev-зависимостями весит много.

**Решение:** Multi-stage build — собираем в одном образе, копируем результат в минимальный.

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

### Graceful Shutdown

**Проблема:** Сервис получает SIGTERM, умирает мгновенно, запросы теряются.

**Решение:** Перехватить сигнал, завершить текущие запросы, освободить ресурсы.

```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // 1. Перестать принимать новые запросы
  server.close();
  
  // 2. Дождаться завершения текущих
  await waitForConnections();
  
  // 3. Закрыть соединения с БД, RabbitMQ
  await database.close();
  await rabbitmq.close();
  
  // 4. Выйти
  process.exit(0);
});
```

### Health Checks

**Liveness probe:** Жив ли процесс? Если нет — перезапустить.
**Readiness probe:** Готов ли принимать трафик? Если нет — не слать запросы.

```typescript
// Liveness — просто отвечает
app.get('/health/live', (req, res) => res.json({ status: 'ok' }));

// Readiness — проверяет зависимости
app.get('/health/ready', async (req, res) => {
  const dbOk = await checkDatabase();
  const mqOk = await checkRabbitMQ();
  
  if (dbOk && mqOk) {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready', db: dbOk, mq: mqOk });
  }
});
```

### Horizontal Scaling

**Вертикальное:** Больше CPU/RAM на одной машине. Ограничено.

**Горизонтальное:** Больше инстансов. Почти безгранично.

**Требования для горизонтального масштабирования:**
- Stateless сервисы (состояние в БД/Redis)
- Load balancer впереди
- Shared session storage
- Database connection pooling

### Environment Variables

**12-Factor App:** Конфигурация в переменных окружения.

```yaml
# docker-compose.yml
services:
  gateway:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgres://...
      - RABBITMQ_URL=amqp://...
```

---

## Ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [NestJS Shutdown Hooks](https://docs.nestjs.com/fundamentals/lifecycle-events)
- [Docker Compose Deploy](https://docs.docker.com/compose/production/)

---

## Задачи

### Задача 7.1: Dockerfile для сервисов

Создай Dockerfile для каждого сервиса в `infrastructure/docker/`:

**gateway.Dockerfile:**
- Multi-stage build
- Stage 1: Build (npm ci, npm run build)
- Stage 2: Production (node:18-alpine, только dist и prod dependencies)
- Healthcheck instruction
- Non-root user для безопасности

Требования:
- Используй .dockerignore
- Кэширование слоёв (COPY package*.json перед COPY .)
- Минимальный размер образа

---

### Задача 7.2: Docker Compose для Production

Создай `docker-compose.prod.yml`:

Отличия от dev:
- Образы собираются, не монтируются volumes с кодом
- Restart policy: unless-stopped
- Resource limits (memory, cpu)
- Logging configuration
- Networks с aliases

```yaml
services:
  gateway:
    build:
      context: .
      dockerfile: infrastructure/docker/gateway.Dockerfile
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

### Задача 7.3: Graceful Shutdown в NestJS

Обнови все сервисы для поддержки graceful shutdown:

**main.ts:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включить shutdown hooks
  app.enableShutdownHooks();
  
  await app.listen(process.env.PORT);
}
```

**AppModule:**
```typescript
@Module({...})
export class AppModule implements OnApplicationShutdown {
  constructor(
    private readonly rabbitMQ: RabbitMQService,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationShutdown(signal: string) {
    console.log(`Shutdown signal: ${signal}`);
    
    // Закрыть RabbitMQ соединение
    await this.rabbitMQ.close();
    
    // Закрыть БД соединение
    await this.dataSource.destroy();
  }
}
```

---

### Задача 7.4: Health Checks Module

Создай модуль health checks для каждого сервиса:

Используй `@nestjs/terminus`:
```bash
npm install @nestjs/terminus
```

**health.controller.ts:**
```typescript
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    // private rabbitmq: RabbitMQHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      // () => this.rabbitmq.pingCheck('rabbitmq'),
    ]);
  }
}
```

---

### Задача 7.5: GitHub Actions — CI

Создай `.github/workflows/ci.yml`:

**Шаги:**
1. Checkout code
2. Setup Node.js
3. Install dependencies (npm ci)
4. Lint (npm run lint)
5. Type check (npm run typecheck)
6. Unit tests (npm run test)
7. Build (npm run build)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Test
        run: npm run test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
      
      - name: Build
        run: npm run build
```

---

### Задача 7.6: GitHub Actions — Build & Push Docker

Создай `.github/workflows/build.yml`:

**Шаги:**
1. Build Docker images
2. Push to Docker Hub (или GitHub Container Registry)
3. Tag с версией (git tag или commit sha)

```yaml
name: Build and Push

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Gateway
        uses: docker/build-push-action@v4
        with:
          context: .
          file: infrastructure/docker/gateway.Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/tg-workout-gateway:${{ github.ref_name }}
            ${{ secrets.DOCKER_USERNAME }}/tg-workout-gateway:latest
```

---

### Задача 7.7: GitHub Actions — Deploy

Создай `.github/workflows/deploy.yml`:

**Стратегия:** SSH на VPS, pull images, docker-compose up.

```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["Build and Push"]
    types:
      - completed

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/tg-workout
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
            docker system prune -f
```

---

### Задача 7.8: Nginx Reverse Proxy

Создай `infrastructure/nginx/nginx.conf`:

**Функции:**
- SSL termination (Let's Encrypt)
- Reverse proxy к Gateway
- Rate limiting
- Gzip compression
- Static file caching (для Mini App)

```nginx
upstream gateway {
    server gateway:3000;
}

server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    location / {
        proxy_pass http://gateway;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### Задача 7.9: Secrets Management

Настрой управление секретами:

**GitHub Secrets:**
- DOCKER_USERNAME
- DOCKER_PASSWORD
- VPS_HOST
- VPS_USER
- VPS_SSH_KEY
- BOT_TOKEN
- GIGACHAT_API_KEY

**На VPS:**
Создай `.env` файл (не в репозитории!):
```bash
# /opt/tg-workout/.env
BOT_TOKEN=xxx
GIGACHAT_API_KEY=xxx
DATABASE_PASSWORD=xxx
RABBITMQ_PASSWORD=xxx
```

Docker Compose читает из `.env`:
```yaml
services:
  bot:
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
```

---

### Задача 7.10: Logging

Настрой централизованное логирование:

**Structured JSON logs:**
```typescript
// packages/utils/src/logger.ts
export const logger = {
  info: (data: object) => console.log(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), ...data })),
  error: (data: object) => console.error(JSON.stringify({ level: 'error', timestamp: new Date().toISOString(), ...data })),
};
```

**Docker logging:**
```yaml
services:
  gateway:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

### Задача 7.11: Horizontal Scaling

Настрой несколько инстансов сервиса:

```yaml
services:
  workout-service:
    image: tg-workout-workout-service
    deploy:
      replicas: 3
    # ...
```

Для dev с docker-compose:
```bash
docker-compose up --scale workout-service=3
```

Nginx автоматически балансирует между инстансами.

---

### Задача 7.12: Database Migrations в CI/CD

Добавь запуск миграций в deploy:

```yaml
# В deploy workflow
- name: Run migrations
  uses: appleboy/ssh-action@master
  with:
    script: |
      cd /opt/tg-workout
      docker-compose -f docker-compose.prod.yml run --rm user-service npm run migration:run
      docker-compose -f docker-compose.prod.yml run --rm workout-service npm run migration:run
```

---

### Задача 7.13: Rollback Strategy

Создай скрипт для отката:

```bash
#!/bin/bash
# infrastructure/scripts/rollback.sh

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <version>"
  exit 1
fi

docker-compose -f docker-compose.prod.yml pull \
  --quiet \
  gateway:$VERSION \
  user-service:$VERSION \
  workout-service:$VERSION

docker-compose -f docker-compose.prod.yml up -d
```

---

### Задача 7.14: Monitoring Endpoints

Добавь endpoint для метрик:

```typescript
@Get('metrics')
getMetrics() {
  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    requests: this.metricsService.getRequestCount(),
    errors: this.metricsService.getErrorCount(),
  };
}
```

---

## Ожидаемый результат

1. **CI pipeline** запускается на каждый PR
2. **Docker образы** собираются и пушатся при тэге
3. **Deploy** автоматический на VPS
4. **Graceful shutdown** работает
5. **Health checks** доступны
6. **Nginx** проксирует запросы
7. **Логи** в JSON формате

---

## Проверочные вопросы

1. Зачем multi-stage build в Docker?
2. Что произойдёт если сервис не реализует graceful shutdown?
3. Разница между liveness и readiness probe?
4. Почему секреты не должны быть в репозитории?
5. Как откатить деплой если что-то пошло не так?
6. Что нужно для горизонтального масштабирования?

---

## Чеклист завершения

- [ ] Dockerfiles созданы для всех сервисов
- [ ] docker-compose.prod.yml работает
- [ ] CI workflow проходит
- [ ] Docker images пушатся в registry
- [ ] Deploy workflow работает
- [ ] Graceful shutdown реализован
- [ ] Health checks отвечают
- [ ] Nginx настроен
