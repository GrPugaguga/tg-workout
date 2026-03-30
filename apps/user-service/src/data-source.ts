import { ENV } from '@app/core'
import { DataSource } from 'typeorm'

import { User } from './users/entities/user.entity'

export default new DataSource({
	type: 'postgres',
	host: ENV.USER_DB_HOST,
	port: ENV.USER_DB_PORT,
	username: ENV.USER_DB_USER,
	password: ENV.USER_DB_PASSWORD,
	entities: [User],
	migrations: ['apps/user-service/src/migrations/*.ts']
})
