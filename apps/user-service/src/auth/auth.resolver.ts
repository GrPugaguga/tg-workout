import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { JwtResponseDto } from './dto/jwt-response.dto'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => JwtResponseDto)
	createJwt(@Args('initData') initData: string) {
		return this.authService.login(initData)
	}
}
