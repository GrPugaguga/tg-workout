import { ENV } from '@app/core'
import { DataSource } from 'typeorm'

import { Equipment, Exercise, MuscleGroup } from './exercise/entities'
import { Workout, WorkoutExercise, WorkoutSet } from './workout/entities'

export default new DataSource({
	type: 'postgres',
	host: ENV.WORKOUT_DB_HOST,
	port: ENV.WORKOUT_DB_PORT,
	username: ENV.WORKOUT_DB_USER,
	password: ENV.WORKOUT_DB_PASSWORD,
	entities: [
		MuscleGroup,
		Equipment,
		Exercise,
		Workout,
		WorkoutExercise,
		WorkoutSet
	],
	migrations: ['apps/workout-service/src/migrations/*.ts']
})
