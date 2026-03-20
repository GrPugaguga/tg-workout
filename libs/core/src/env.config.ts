import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'

function findEnvFile(startDir: string): string | undefined {
	let dir = startDir
	while (true) {
		const envPath = path.join(dir, '.env')
		if (fs.existsSync(envPath)) return envPath
		const parent = path.dirname(dir)
		if (parent === dir) return undefined
		dir = parent
	}
}

dotenv.config({ path: findEnvFile(process.cwd()) })

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	LOG_LEVEL: z
		.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
		.default('info'),

	GATEWAY_PORT: z.coerce.number().default(3000),
	GATEWAY_URL: z.string().default('http://localhost:3000/graphql'),

	USER_SERVICE_PORT: z.coerce.number().default(3001),
	USER_DB_HOST: z.string(),
	USER_DB_PORT: z.coerce.number(),
	USER_DB_USER: z.string(),
	USER_DB_PASSWORD: z.string(),

	WORKOUT_DB_HOST: z.string(),
	WORKOUT_DB_PORT: z.coerce.number(),
	WORKOUT_DB_USER: z.string(),
	WORKOUT_DB_PASSWORD: z.string(),
	WORKOUT_SERVICE_PORT: z.coerce.number().default(3002),

	AI_SERVICE_PORT: z.coerce.number().default(3003),

	RABBIT_USER: z.string(),
	RABBIT_PASSWORD: z.string(),
	RABBITMQ_URL: z.string(),

	REDIS_USER: z.string(),
	REDIS_PASSWORD: z.string(),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_URL: z.string().optional(),

	BOT_TOKEN: z.string(),
	BOT_SERVICE_PORT: z.coerce.number().default(3004),
	BOT_SECRET: z.string(),
	BOT_WEBHOOK_URL: z.string().optional(),

	JWT_SECRET: z.string(),
	JWT_EXPIRES_IN: z.coerce.number().default(86400),

	TYPESENSE_API_KEY: z.string(),
	TYPESENSE_URL: z.string(),

	OPENAI_API_KEY: z.string(),
})

export const ENV = envSchema.parse(process.env)
