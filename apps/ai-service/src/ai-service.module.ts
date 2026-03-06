import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { AgentModule } from './agent/agent.module';
import { HealthModule } from './health/health.module';
import { createLoggerModule } from '@app/utils';

@Module({
  imports: [
    createLoggerModule('ai-service'),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
        driver: ApolloFederationDriver,
        autoSchemaFile: {federation: 2},
        buildSchemaOptions: {
            scalarsMap: [{ type: () => GraphQLJSON, scalar: GraphQLJSON }]
        }
    }),
    AgentModule,
    HealthModule
  ],
  providers: [],
})
export class AiServiceModule {}
