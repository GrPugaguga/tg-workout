import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import dataSource from './data-source'
import { HealthModule } from './health/health.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		TypeOrmModule.forRoot(dataSource.options),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true
		}),
		UsersModule,
		AuthModule,
		HealthModule
	],
	controllers: [],
	providers: [AppService]
})
export class AppModule {}
