import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway'
import { ENV, X_CORRELATION_ID, X_TELEGRAM_ID, X_USER_ID } from '@app/core'
import { createLoggerModule } from '@app/utils'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'

import { HealthModule } from './health/health.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware'

@Module({
	imports: [
		createLoggerModule('gateway'),
		JwtModule.register({
			secret: ENV.JWT_SECRET
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 100
			}
		]),
		GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
			driver: ApolloGatewayDriver,
			server: {
				csrfPrevention: false,
				context: ({ req, res }) => ({ req, res })
			},
			gateway: {
				supergraphSdl: new IntrospectAndCompose({
					subgraphs: [
						{
							name: 'users',
							url: `http://${ENV.USER_SERVICE_HOST}:${ENV.USER_SERVICE_PORT}/graphql`
						},
						{
							name: 'workouts',
							url: `http://${ENV.WORKOUT_SERVICE_HOST}:${ENV.WORKOUT_SERVICE_PORT}/graphql`
						},
						{
							name: 'ai',
							url: `http://${ENV.AI_SERVICE_HOST}:${ENV.AI_SERVICE_PORT}/graphql`
						}
					]
				}),
				buildService({ url }) {
					return new RemoteGraphQLDataSource({
						url,
						willSendRequest({ request, context }) {
							if (context.req) {
								const headers = context.req.headers
								if (headers[X_USER_ID]) {
									request.http?.headers.set(
										X_USER_ID,
										headers[X_USER_ID] as string
									)
								}
								if (headers[X_TELEGRAM_ID]) {
									request.http?.headers.set(
										X_TELEGRAM_ID,
										headers[X_TELEGRAM_ID] as string
									)
								}
								if (headers[X_CORRELATION_ID]) {
									request.http?.headers.set(
										X_CORRELATION_ID,
										headers[X_CORRELATION_ID] as string
									)
								}
							}
						}
					})
				}
			}
		}),
		HealthModule
	]
})
export class GatewayModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelationIdMiddleware, AuthMiddleware).forRoutes('*')
	}
}
