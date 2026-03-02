import { ENV } from '@app/core'
import { CLIENTS, QUEUES } from '@app/contracts'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Equipment } from './entities/equipment.entity'
import { Exercise } from './entities/exercise.entity'
import { MuscleGroup } from './entities/muscle-group.entity'
import { ExerciseHandler } from './exercise.handler'
import { ExerciseResolver } from './exercise.resolver'
import { ExerciseService } from './exercise.service'
import { ExerciseRepository } from './repository/exercise.repository'
import { ExerciseRepositoryPort } from './repository/exercise.repository.abstract'

@Module({
	imports: [
		TypeOrmModule.forFeature([Exercise, MuscleGroup, Equipment]),
		ClientsModule.register([
			{
				name: CLIENTS.SYNC_SERVICE,
				transport: Transport.RMQ,
				options: {
					urls: [ENV.RABBITMQ_URL],
					queue: QUEUES.SYNC,
					queueOptions: { durable: true },
				},
			},
		]),
	],
	controllers: [ExerciseHandler],
	providers: [
		ExerciseResolver,
		ExerciseService,
		{
			provide: ExerciseRepositoryPort,
			useClass: ExerciseRepository
		}
	],
	exports: [ExerciseService]
})
export class ExerciseModule {}
