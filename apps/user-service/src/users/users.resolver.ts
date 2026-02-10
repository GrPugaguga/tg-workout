import { AuthenticatedGuard, CurrentUser, FederationUser } from '@app/core'
import { UseGuards } from '@nestjs/common'
import {
	Args,
	Mutation,
	Query,
	Resolver,
	ResolveReference
} from '@nestjs/graphql'

import { OnlySelfGuard } from '../auth/guards/only-self.guard'

import { CreateUserInput } from './dto/create-user.input'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@ResolveReference()
	resolveReference(reference: { __typename: string; id: string }) {
		return this.usersService.findOne(reference.id)
	}

	@Mutation(() => User)
	createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.usersService.create(createUserInput)
	}

	@UseGuards(AuthenticatedGuard)
	@Query(() => User, { name: 'me' })
	me(@CurrentUser() user: FederationUser) {
		return this.usersService.findOne(user.id)
	}

	@Query(() => User, { name: 'userByTelegramId' })
	userByTelegramId(@Args('telegramId') telegramId: number) {
		return this.usersService.findByTg(telegramId)
	}

	@UseGuards(AuthenticatedGuard, OnlySelfGuard)
	@Mutation(() => User)
	removeUser(@Args('id') id: string) {
		return this.usersService.remove(id)
	}
}
