import { ENV } from '@app/core'
import { DataSource } from 'typeorm'

export default new DataSource({
	type: 'postgres',
	host: ENV.WORKOUT_DB_HOST,
	port: ENV.WORKOUT_DB_PORT,
	username: ENV.WORKOUT_DB_USER,
	password: ENV.WORKOUT_DB_PASSWORD,
	entities: [],
	migrations: ['apps/workout-service/src/migrations/*.ts']
})
