import { ENV } from '@app/core'
import { CLIENTS, QUEUES } from '@app/contracts'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ExerciseModule } from '../exercise/exercise.module'

import { WorkoutExercise } from './entities/workout-exercise.entity'
import { WorkoutSet } from './entities/workout-set.entity'
import { Workout } from './entities/workout.entity'
import { WorkoutEventsListener } from './events/workout-events.listener'
import { WorkoutRepository } from './repository/workout.repository'
import { WorkoutRepositoryPort } from './repository/workout.repository.abstract'
import { WorkoutCommandService } from './workout-command.service'
import { WorkoutQueryService } from './workout-query.service'
import { WorkoutResolver } from './workout.resolver'

@Module({
	imports: [
		TypeOrmModule.forFeature([Workout, WorkoutExercise, WorkoutSet]),
		ExerciseModule,
		ClientsModule.register([
			{
				name: CLIENTS.PARSING_SERVICE,
				transport: Transport.RMQ,
				options: {
					urls: [ENV.RABBITMQ_URL],
					queue: QUEUES.PARSING,
					queueOptions: { durable: true },
				},
			},
		]),
	],
	providers: [
		WorkoutResolver,
		WorkoutCommandService,
		WorkoutQueryService,
		WorkoutEventsListener,
		{
			provide: WorkoutRepositoryPort,
			useClass: WorkoutRepository
		}
	],
	exports: [WorkoutQueryService]
})
export class WorkoutModule {}
