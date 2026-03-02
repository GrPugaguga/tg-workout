import { ENV } from '@app/core'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { SyncServiceController } from './sync-service.controller'
import { SyncServiceService } from './sync-service.service'
import { CLIENTS, QUEUES } from '@app/contracts'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: CLIENTS.WORKOUT_SERVICE,
				transport: Transport.RMQ,
				options: {
					urls: [ENV.RABBITMQ_URL],
					queue: QUEUES.WORKOUT,
					queueOptions: { durable: true },
				},
			},
		]),
	],
	controllers: [SyncServiceController],
	providers: [SyncServiceService],
})
export class SyncServiceModule {}
