import { ENV } from '@app/core'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from '../users/users.module'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			global: true,
			useFactory: () => ({
				secret: ENV.JWT_SECRET,
				signOptions: { expiresIn: ENV.JWT_EXPIRES_IN }
			})
		}),
		PassportModule
	],
	providers: [AuthResolver, AuthService, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule {}
