import { ENV } from '@app/core'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createHmac } from 'crypto'
import { parse, isValid } from '@tma.js/init-data-node'

import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'

import { JwtResponseDto } from './dto/jwt-response.dto'
import { TelegramUserDto } from './dto/telegramUser.dto'

interface JwtPayload {
	sub: string
	telegramId: number
	username: string | undefined
}

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async generateToken(user: User): Promise<JwtResponseDto> {
		const payload: JwtPayload = {
			sub: user.id,
			telegramId: user.telegramId.get(),
			username: user.username
		}
		return {
			accessToken: this.jwtService.sign(payload),
			expiredAt: Date.now() + ENV.JWT_EXPIRES_IN * 1000
		}
	}

	async login(initData: string): Promise<JwtResponseDto> {
		const telegramUser = await this.validateTelegramInitData(initData)

		const user = await this.usersService.findOrCreate({
			telegramId: telegramUser.id,
			username: telegramUser.username,
			firstName: telegramUser.first_name,
			lastName: telegramUser.last_name
		})

		return this.generateToken(user)
	}

	async validateTelegramInitData(initData: string): Promise<TelegramUserDto> {
		
		if (!isValid(initData, ENV.BOT_TOKEN)) {
			throw new UnauthorizedException('Invalid Telegram init data')
		}

		const params = parse(initData)

		const userJson = params.user

		if (!userJson) throw new UnauthorizedException('User data not found')

		return userJson
	}
}
