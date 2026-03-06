import { ENV } from '@app/core'
import { initTypesense } from '@app/typesense'
import { QUEUES } from '@app/contracts'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { ParsingServiceModule } from './parsing-service.module'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
	initTypesense()

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(ParsingServiceModule, {
		transport: Transport.RMQ,
		options: {
			urls: [ENV.RABBITMQ_URL],
			queue: QUEUES.PARSING,
			queueOptions: { durable: true },
		},
	})

	app.useLogger(app.get(Logger))

	await app.listen()
}
bootstrap()
