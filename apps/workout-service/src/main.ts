import { ENV } from '@app/core'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { WorkoutServiceModule } from './app.module'
import { Transport } from '@nestjs/microservices'
import { QUEUES } from '@app/contracts'

async function bootstrap() {
	const app = await NestFactory.create(WorkoutServiceModule, {
		bufferLogs: true
	})
	await app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [ENV.RABBITMQ_URL],
			queue: QUEUES.WORKOUT,
			queueOptions: { durable: true },
		},
	})
	app.useLogger(app.get(Logger))
	await app.startAllMicroservices()
	await app.listen(ENV.WORKOUT_SERVICE_PORT)
}
bootstrap()
