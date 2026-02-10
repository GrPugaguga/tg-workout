import { ENV } from '@app/core'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UsersModule } from '../users/users.module'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			global: true,
			useFactory: () => ({
				secret: ENV.JWT_SECRET,
				signOptions: { expiresIn: ENV.JWT_EXPIRES_IN }
			})
		})
	],
	providers: [AuthResolver, AuthService],
	exports: [AuthService]
})
export class AuthModule {}
