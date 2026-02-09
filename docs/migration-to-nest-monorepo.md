# Миграция на NestJS Native Monorepo

## Зачем

Сейчас: npm workspaces + кастомные path aliases (`@core/*`, `@utils/*`). Проблема: TypeScript алиасы не резолвятся в рантайме, нужен webpack/tsconfig-paths/tsc-alias.

NestJS native monorepo: один `nest-cli.json`, один `package.json`, CLI сам настраивает webpack, алиасы, билды. Всё работает из коробки.

---

## Структура ДО (сейчас)

```
tg-workout/
├── apps/
│   ├── gateway/          ← свой package.json, nest-cli.json
│   └── user-service/     ← свой package.json, nest-cli.json
├── packages/
│   ├── core/             ← env.config.ts
│   ├── utils/            ← logger.ts, UUID.ts
│   ├── contracts/        ← events
│   └── database/         ← base entity, inbox/outbox
├── package.json          ← npm workspaces
├── tsconfig.base.json
├── docker-compose.yml
└── .env
```

## Структура ПОСЛЕ

```
tg-workout/
├── apps/
│   ├── gateway/
│   │   ├── src/
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   └── user-service/
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── auth/
│       │   ├── users/
│       │   └── health/
│       └── tsconfig.app.json
├── libs/
│   ├── core/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── env.config.ts
│   │   └── tsconfig.lib.json
│   ├── utils/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── logger.ts
│   │   │   └── UUID.ts
│   │   └── tsconfig.lib.json
│   ├── contracts/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── events/
│   │   └── tsconfig.lib.json
│   └── database/
│       ├── src/
│       │   ├── index.ts
│       │   ├── base.entity.ts
│       │   ├── inbox.entity.ts
│       │   └── outbox.entity.ts
│       └── tsconfig.lib.json
├── nest-cli.json          ← ОДИН на весь проект
├── tsconfig.json          ← корневой tsconfig
├── package.json           ← ОДИН, без workspaces
├── docker-compose.yml
└── .env
```

---

## Шаги миграции

### Шаг 1: Подготовка — сохрани текущий код

```bash
git add -A && git commit -m "chore: snapshot before monorepo migration"
```

### Шаг 2: Создай новый NestJS проект

В отдельной папке, чтобы скопировать конфиги:

```bash
cd ..
nest new tg-workout-mono --package-manager npm --skip-git
cd tg-workout-mono
```

Это создаст стандартную структуру с правильным `tsconfig.json` и `nest-cli.json`.

### Шаг 3: Добавь приложения

```bash
nest g app user-service
nest g app gateway
```

NestJS CLI автоматически:
- Создаст `apps/user-service/` и `apps/gateway/`
- Перенесёт дефолтное приложение в `apps/tg-workout-mono/`
- Обновит `nest-cli.json` с `"monorepo": true`
- Создаст `tsconfig.app.json` для каждого приложения

Дефолтное приложение (`apps/tg-workout-mono/`) можно удалить.

### Шаг 4: Добавь библиотеки

```bash
nest g lib core
nest g lib utils
nest g lib contracts
nest g lib database
```

Для каждой библиотеки NestJS CLI:
- Создаст `libs/<name>/src/index.ts` и `<name>.module.ts`
- Добавит в `nest-cli.json`
- Настроит path alias `@app/<name>` в `tsconfig.json`

### Шаг 5: Перенеси код

#### 5.1 Библиотеки (`libs/`)

Скопируй содержимое из `packages/*/src/` в `libs/*/src/`:

```
packages/core/src/env.config.ts     → libs/core/src/env.config.ts
packages/utils/src/logger.ts        → libs/utils/src/logger.ts
packages/utils/src/UUID.ts          → libs/utils/src/UUID.ts
packages/contracts/src/events/*     → libs/contracts/src/events/*
packages/database/src/base.entity.ts → libs/database/src/base.entity.ts
packages/database/src/inbox.entity.ts → libs/database/src/inbox.entity.ts
packages/database/src/outbox.entity.ts → libs/database/src/outbox.entity.ts
```

Обнови `index.ts` в каждой библиотеке — реэкспортируй всё:

```typescript
// libs/core/src/index.ts
export * from './env.config';

// libs/utils/src/index.ts
export * from './logger';
export * from './UUID';

// libs/contracts/src/index.ts
export * from './events';

// libs/database/src/index.ts
export * from './base.entity';
export * from './inbox.entity';
export * from './outbox.entity';
```

#### 5.2 User Service (`apps/user-service/`)

Скопируй содержимое `apps/user-service/src/` целиком:
- `auth/` (со всеми dto, guards, strategies)
- `users/` (со всеми entities, value-objects, dto)
- `health/`
- `app.module.ts`
- `main.ts`

#### 5.3 Gateway (`apps/gateway/`)

Скопируй содержимое `apps/gateway/src/`.

### Шаг 6: Замени импорты

Во всех файлах замени старые алиасы на `@app/*`:

```
import { ENV } from '@core/env.config'     → import { ENV } from '@app/core'
import { createLogger } from '@utils/logger' → import { createLogger } from '@app/utils'
import { BaseEntity } from '@database/base.entity' → import { BaseEntity } from '@app/database'
```

Обрати внимание: в NestJS monorepo импортируешь из `@app/<lib>` (через index.ts), а не из конкретных файлов.

### Шаг 7: Перенеси зависимости

Все зависимости из `apps/user-service/package.json` и `apps/gateway/package.json` добавь в корневой `package.json`. В NestJS monorepo — **один package.json на всё**.

Ключевые зависимости:
```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/apollo": "^13.2.4",
    "@nestjs/graphql": "^13.2.4",
    "@nestjs/jwt": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/terminus": "^11.0.0",
    "@nestjs/typeorm": "^11.0.0",
    "apollo-server-express": "^3.13.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.3",
    "dotenv": "^16.0.0",
    "graphql": "^16.12.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "pg": "^8.18.0",
    "pino": "^10.3.0",
    "pino-pretty": "^13.1.3",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.28",
    "zod": "^4.3.6"
  }
}
```

### Шаг 8: Перенеси конфигурацию

- `docker-compose.yml` → скопируй как есть
- `.env` и `.env.example` → скопируй как есть
- `.gitignore` → скопируй и добавь `dist/`

### Шаг 9: Настрой dotenv

В `libs/core/src/env.config.ts` оставь `findEnvFile` + `dotenv.config()` — это по-прежнему нужно чтобы `.env` из корня загружался.

### Шаг 10: Удали лишнее

- Удали `packages/` (теперь `libs/`)
- Удали отдельные `package.json` из `apps/*/`
- Удали отдельные `nest-cli.json` из `apps/*/`
- Удали `tsconfig.base.json` (теперь корневой `tsconfig.json`)
- Удали `webpack.config.js`

---

## Результат: nest-cli.json

Примерно так будет выглядеть после `nest g app` и `nest g lib`:

```json
{
  "monorepo": true,
  "root": "apps/user-service",
  "sourceRoot": "apps/user-service/src",
  "compilerOptions": {
    "webpack": true,
    "tsConfigPath": "apps/user-service/tsconfig.app.json"
  },
  "projects": {
    "user-service": {
      "type": "application",
      "root": "apps/user-service",
      "entryFile": "main",
      "sourceRoot": "apps/user-service/src",
      "compilerOptions": {
        "tsConfigPath": "apps/user-service/tsconfig.app.json"
      }
    },
    "gateway": {
      "type": "application",
      "root": "apps/gateway",
      "entryFile": "main",
      "sourceRoot": "apps/gateway/src",
      "compilerOptions": {
        "tsConfigPath": "apps/gateway/tsconfig.app.json"
      }
    },
    "core": {
      "type": "library",
      "root": "libs/core",
      "entryFile": "index",
      "sourceRoot": "libs/core/src",
      "compilerOptions": {
        "tsConfigPath": "libs/core/tsconfig.lib.json"
      }
    },
    "utils": {
      "type": "library",
      "root": "libs/utils",
      "entryFile": "index",
      "sourceRoot": "libs/utils/src",
      "compilerOptions": {
        "tsConfigPath": "libs/utils/tsconfig.lib.json"
      }
    },
    "contracts": {
      "type": "library",
      "root": "libs/contracts",
      "entryFile": "index",
      "sourceRoot": "libs/contracts/src",
      "compilerOptions": {
        "tsConfigPath": "libs/contracts/tsconfig.lib.json"
      }
    },
    "database": {
      "type": "library",
      "root": "libs/database",
      "entryFile": "index",
      "sourceRoot": "libs/database/src",
      "compilerOptions": {
        "tsConfigPath": "libs/database/tsconfig.lib.json"
      }
    }
  }
}
```

## Результат: tsconfig.json (корневой)

NestJS CLI создаст его автоматически. Примерно:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@app/core": ["libs/core/src"],
      "@app/core/*": ["libs/core/src/*"],
      "@app/utils": ["libs/utils/src"],
      "@app/utils/*": ["libs/utils/src/*"],
      "@app/contracts": ["libs/contracts/src"],
      "@app/contracts/*": ["libs/contracts/src/*"],
      "@app/database": ["libs/database/src"],
      "@app/database/*": ["libs/database/src/*"]
    }
  }
}
```

---

## Команды после миграции

```bash
# Разработка
nest start user-service --watch
nest start gateway --watch

# Билд
nest build user-service
nest build gateway

# Запуск в продакшене
node dist/apps/user-service/main.js
node dist/apps/gateway/main.js
```

Корневой `package.json` скрипты:

```json
{
  "scripts": {
    "dev:user": "nest start user-service --watch",
    "dev:gateway": "nest start gateway --watch",
    "build:user": "nest build user-service",
    "build:gateway": "nest build gateway",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

---

## Важные нюансы

1. **Webpack включён по умолчанию** в monorepo mode — NestJS CLI сам обрабатывает все кросс-ссылки между `libs/` и `apps/`. Не нужен кастомный webpack конфиг.

2. **`@app/*` — стандартный префикс**. NestJS CLI генерирует его при `nest g lib`. Можно изменить при создании.

3. **Один `node_modules/`** в корне. Нет npm workspaces, нет hoisting проблем.

4. **Каждая lib создаёт NestJS Module** (`CoreModule`, `UtilsModule`). Для чистых утилит (env.config, logger) модуль необязателен — можно просто экспортировать из `index.ts`.

5. **dotenv** всё равно нужен в `env.config.ts` чтобы загрузить `.env` до старта NestJS. Это нормально.

6. **Не нужны `@nestjs/config` и `ConfigModule`** — у нас уже есть Zod валидация в `@app/core`.
