import { ENV } from '@app/core'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { WorkoutServiceModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(WorkoutServiceModule, {
		bufferLogs: true
	})
	app.useLogger(app.get(Logger))
	await app.listen(ENV.WORKOUT_SERVICE_PORT)
}
bootstrap()
