import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { CreateUserInput } from './dto/create-user.input'
import { User } from './entities/user.entity'
import { UserRepositoryPort } from './repository/user.repository.abstract'
import { TelegramId } from './value-objects/telegramId.value-object'

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UserRepositoryPort) {}

	async create(createUserInput: CreateUserInput): Promise<User> {
		const telegramId = new TelegramId(createUserInput.telegramId)
		const existing = await this.isExist(telegramId)
		if (existing)
			throw new ConflictException(
				`User with id ${telegramId.get()} already exist`
			)

		const newUser = this.usersRepository.create({
			...createUserInput,
			telegramId: telegramId
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
		const telegramId = new TelegramId(createUserInput.telegramId)
		const existing = await this.isExist(telegramId)
		if (existing) return existing

		const newUser = this.usersRepository.create({
			...createUserInput,
			telegramId: telegramId
		})
		return await this.usersRepository.save(newUser)
	}

	async findByTg(telegramId: number): Promise<User> {
		const user = await this.usersRepository.findByTelegramId(
			new TelegramId(telegramId)
		)
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

	private async isExist(telegramId: TelegramId): Promise<User | undefined> {
		const existing = await this.usersRepository.findByTelegramId(telegramId)
		if (existing) return existing
	}
}
