import { createLoggerModule } from '@app/utils'
import {
	ApolloFederationDriver,
	ApolloFederationDriverConfig
} from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommonModule } from './common/common.module'
import { User } from './common/entities/user.reference'
import dataSource from './data-source'
import { ExerciseModule } from './exercise/exercise.module'
import { HealthModule } from './health/health.module'
import { WorkoutModule } from './workout/workout.module'

@Module({
	imports: [
		createLoggerModule('workout-service'),
		EventEmitterModule.forRoot(),
		TypeOrmModule.forRoot({ ...dataSource.options, migrations: [] }),
		GraphQLModule.forRoot<ApolloFederationDriverConfig>({
			driver: ApolloFederationDriver,
			autoSchemaFile: { federation: 2 },
			buildSchemaOptions: {
				orphanedTypes: [User]
			}
		}),
		WorkoutModule,
		ExerciseModule,
		HealthModule,
		CommonModule
	]
})
export class WorkoutServiceModule {}
