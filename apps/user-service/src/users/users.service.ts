import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserInput } from './dto/create-user.input'
import { User } from './entities/user.entity'
import { TelegramId } from './value-objects/telegramId.value-object'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	async create(createUserInput: CreateUserInput): Promise<User> {
		const newUser = await this.usersRepository.create({
			...createUserInput,
			telegramId: new TelegramId(createUserInput.telegramId)
		})
		return await this.usersRepository.save(newUser)
	}

	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { id: id } })
		if (!user)
			throw new NotFoundException(`User with id ${id} is not found`)
		return user
	}

	async findOrCreate(createUserInput: CreateUserInput): Promise<User> {
		const existing = await this.usersRepository.findOne({
			where: { telegramId: new TelegramId(createUserInput.telegramId) }
		})
		if (existing) return existing

		return this.create(createUserInput)
	}

	async findByTg(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { telegramId: new TelegramId(id) }
		})
		if (!user)
			throw new NotFoundException(`User with id ${id} is not found`)
		return user
	}

	async remove(id: number): Promise<void> {
		const result = await this.usersRepository.delete({
			telegramId: new TelegramId(id)
		})
		if (result.affected === 0)
			throw new NotFoundException(`User with id ${id} is not found`)
	}
}
