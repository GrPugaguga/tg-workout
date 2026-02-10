import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OnlySelfGuard } from '../auth/guards/only-self.guard'

import { CreateUserInput } from './dto/create-user.input'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Mutation(() => User)
	createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.usersService.create(createUserInput)
	}

	@UseGuards(JWTAuthGuard)
	@Query(() => User, { name: 'me' })
	me(@CurrentUser() user: User) {
		return user
	}

	@Query(() => User, { name: 'userByTelegramId' })
	userByTelegramId(@Args('telegramId') telegramId: number) {
		return this.usersService.findByTg(telegramId)
	}

	@UseGuards(JWTAuthGuard, OnlySelfGuard)
	@Mutation(() => User)
	removeUser(@Args('id') id: string) {
		return this.usersService.remove(id)
	}
}
