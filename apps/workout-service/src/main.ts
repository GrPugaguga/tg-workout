import { ENV } from '@app/core'
import { createLogger } from '@app/utils'
import { NestFactory } from '@nestjs/core'

import { WorkoutServiceModule } from './app.module'

export const logger = createLogger('workout-service')

async function bootstrap() {
	const app = await NestFactory.create(WorkoutServiceModule)
	await app.listen(ENV.WORKOUT_SERVICE_PORT)
	logger.info(`Server start on http://localhost:${ENV.WORKOUT_SERVICE_PORT}`)
	logger.info(
		`Health check on http://localhost:${ENV.WORKOUT_SERVICE_PORT}/health`
	)
}
bootstrap()
