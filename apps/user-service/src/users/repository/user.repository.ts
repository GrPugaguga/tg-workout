import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '../entities/user.entity'
import { TelegramId } from '../value-objects/telegramId.value-object'

import { UserRepositoryPort } from './user.repository.abstract'

@Injectable()
export class UserRepository extends UserRepositoryPort {
	constructor(@InjectRepository(User) private repo: Repository<User>) {
		super()
	}

	create(user: Omit<User, 'id'>): User {
		return this.repo.create(user)
	}

	async findById(id: string): Promise<User | null> {
		return this.repo.findOne({ where: { id } })
	}

	async findByTelegramId(telegramId: TelegramId): Promise<User | null> {
		return this.repo.findOne({ where: { telegramId } })
	}

	async save(user: User): Promise<User> {
		return this.repo.save(user)
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.repo.delete(id)
		if (result.affected === 0) return false
		return true
	}
}
