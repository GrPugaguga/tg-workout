import {
	ApolloFederationDriver,
	ApolloFederationDriverConfig
} from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './auth/auth.module'
import dataSource from './data-source'
import { HealthModule } from './health/health.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		TypeOrmModule.forRoot({ ...dataSource.options, migrations: [] }),
		GraphQLModule.forRoot<ApolloFederationDriverConfig>({
			driver: ApolloFederationDriver,
			autoSchemaFile: { federation: 2 }
		}),
		UsersModule,
		AuthModule,
		HealthModule
	]
})
export class AppModule {}
