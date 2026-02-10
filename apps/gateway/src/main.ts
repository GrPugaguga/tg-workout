import { ENV } from '@app/core'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { GatewayModule } from './gateway.module'

async function bootstrap() {
	const app = await NestFactory.create(GatewayModule)
	await app.listen(ENV.GATEWAY_PORT)
	Logger.log(
		`Gateway running on http://localhost:${ENV.GATEWAY_PORT}/graphql`
	)
}
bootstrap()
