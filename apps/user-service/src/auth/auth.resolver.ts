import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { JwtResponseDto, LoginByTelegramDto } from '@app/contracts'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => JwtResponseDto)
	createJwt(@Args('initData') initData: string) {
		return this.authService.login(initData)
	}
	@Mutation(() => JwtResponseDto)
	loginByTelegram(@Args('loginByTelegramDto') loginByTelegramDto: LoginByTelegramDto){
		return this.authService.loginByTelegram(loginByTelegramDto.telegramId, loginByTelegramDto.botSecret)
	}
}
