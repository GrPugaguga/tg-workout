# Универсальный Dockerfile для всех NestJS сервисов монорепы
# Использование: docker build --build-arg APP_NAME=gateway .

ARG NODE_VERSION=22-alpine

# --- Stage 1: Install dependencies ---
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# --- Stage 2: Build target app ---
FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG APP_NAME
RUN npx nest build ${APP_NAME}

# --- Stage 3: Production image ---
FROM node:${NODE_VERSION} AS production
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

USER appuser

CMD ["sh", "-c", "node $(find dist/apps/${APP_NAME} -name main.js | head -1)"]
