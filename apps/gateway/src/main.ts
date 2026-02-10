import { ENV } from '@app/core'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { GatewayModule } from './gateway.module'

async function bootstrap() {
	const app = await NestFactory.create(GatewayModule, { bufferLogs: true })
	app.useLogger(app.get(Logger))
	await app.listen(ENV.GATEWAY_PORT)
}
bootstrap()
