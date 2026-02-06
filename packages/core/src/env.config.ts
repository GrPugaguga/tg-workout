import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  
    GATEWAY_PORT: z.coerce.number().default(3000),

    USER_SERVICE_PORT: z.coerce.number().default(3001),
    USER_DB_USER: z.string(),
    USER_DB_PASSWORD: z.string(),

    WORKOUT_DB_USER: z.string(),
    WORKOUT_DB_PASSWORD: z.string(),
    WORKOUT_SERVICE_PORT: z.coerce.number().default(3002),

    RABBIT_USER: z.string(),
    RABBIT_PASSWORD: z.string(),
    RABBITMQ_URL: z.string()
})

export const ENV = envSchema.parse(process.env)
