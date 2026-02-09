import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ENV } from '@app/core'
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: ENV.USER_DB_HOST,
      port: ENV.USER_DB_PORT,
      username: ENV.USER_DB_USER,
      password: ENV.USER_DB_PASSWORD,
      synchronize: false,
      entities:[User]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
    }),
    UsersModule,
    AuthModule,
    HealthModule],
  controllers: [],
  providers: [AppService, ],
})
export class AppModule {}
