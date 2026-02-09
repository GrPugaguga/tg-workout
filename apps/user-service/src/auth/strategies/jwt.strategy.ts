import { ENV } from '@app/core'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '../../users/entities/user.entity'
import { UsersService } from '../../users/users.service'

export interface JwtPayload {
	sub: string
	telegramId: number
	username: string | undefined
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: ENV.JWT_SECRET
		})
	}

	async validate(payload: JwtPayload): Promise<User> {
		return this.userService.findOne(payload.sub)
	}
}
