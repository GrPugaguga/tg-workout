import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateUserInput } from './dto/create-user.input'
import { User } from './entities/user.entity'
import { UserRepositoryPort } from './repository/user.repository.abstract'
import { TelegramId } from './value-objects/telegramId.value-object'

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UserRepositoryPort) {}

	async create(createUserInput: CreateUserInput): Promise<User> {
		const newUser = this.usersRepository.create({
			...createUserInput,
			telegramId: new TelegramId(createUserInput.telegramId)
		})
		return await this.usersRepository.save(newUser)
	}

	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findById(id)
		if (!user)
			throw new NotFoundException(`User with id ${id} is not found`)
		return user
	}

	async findOrCreate(createUserInput: CreateUserInput): Promise<User> {
		const existing = await this.usersRepository.findByTelegramId(
			new TelegramId(createUserInput.telegramId)
		)
		if (existing) return existing

		return this.create(createUserInput)
	}

	async findByTg(telegramId: TelegramId): Promise<User> {
		const user = await this.usersRepository.findByTelegramId(telegramId)
		if (!user)
			throw new NotFoundException(
				`User with id ${telegramId} is not found`
			)
		return user
	}

	async remove(id: string): Promise<void> {
		const result = await this.usersRepository.delete(id)
		if (!result)
			throw new NotFoundException(`User with id ${id} is not found`)
	}
}
