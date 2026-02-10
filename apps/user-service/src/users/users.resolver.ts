import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard'

import { CreateUserInput } from './dto/create-user.input'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { TelegramId } from './value-objects/telegramId.value-object'

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Mutation(() => User)
	createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.usersService.create(createUserInput)
	}

	@Query(() => User, { name: 'user' })
	findOne(@Args('id') id: string) {
		return this.usersService.findOne(id)
	}

	@Query(() => User, { name: 'user' })
	userByTelegramId(@Args('telegramId') telegramId: TelegramId) {
		return this.usersService.findByTg(telegramId)
	}

	@Mutation(() => User)
	removeUser(@Args('id', { type: () => Int }) id: string) {
		return this.usersService.remove(id)
	}
}
