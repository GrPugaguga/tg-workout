import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard'

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

	@Query(() => User, { name: 'user' })
	findOne(@Args('id') id: string) {
		return this.usersService.findOne(id)
	}

	@Mutation(() => User)
	@UseGuards(JWTAuthGuard)
	removeUser(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.remove(id)
	}
}
