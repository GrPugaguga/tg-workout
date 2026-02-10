import { User } from '../entities/user.entity'
import { TelegramId } from '../value-objects/telegramId.value-object'

export abstract class UserRepositoryPort {
	abstract findById(id: string): Promise<User | null>
	abstract findByTelegramId(telegramId: TelegramId): Promise<User | null>
	abstract save(user: User): Promise<User>
	abstract delete(id: string): Promise<boolean>
	abstract create(user: Omit<User, 'id'>): User
}
