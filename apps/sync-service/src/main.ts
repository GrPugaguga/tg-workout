import { ENV } from '@app/core'
import { initTypesense } from '@app/typesense'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { SyncServiceModule } from './sync-service.module'
import { QUEUES } from '@app/contracts'

async function bootstrap() {
	initTypesense()
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(SyncServiceModule, {
		transport: Transport.RMQ,
		options: {
			urls: [ENV.RABBITMQ_URL],
			queue: QUEUES.SYNC,
			queueOptions: { durable: true },
		},
	})

	await app.listen()
}
bootstrap()
