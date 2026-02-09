import { ENV } from '@app/core'
import { createLogger } from '@app/utils'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

export const logger = createLogger('user-service')

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(ENV.USER_SERVICE_PORT)
	logger.info(`Server start on http://localhost:${ENV.USER_SERVICE_PORT}`)
	logger.info(
		`Health check on http://localhost:${ENV.USER_SERVICE_PORT}/health`
	)
}
bootstrap()
