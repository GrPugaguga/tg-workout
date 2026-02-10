import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import dataSource from './data-source'
import { ExerciseModule } from './exercise/exercise.module'
import { HealthModule } from './health/health.module'
import { WorkoutModule } from './workout/workout.module'

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		TypeOrmModule.forRoot({ ...dataSource.options, migrations: [] }),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true
		}),
		WorkoutModule,
		ExerciseModule,
		HealthModule
	]
})
export class WorkoutServiceModule {}
