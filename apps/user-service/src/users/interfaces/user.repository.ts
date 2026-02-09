import { CreateUserInput } from '../dto/create-user.input'
import { User } from '../entities/user.entity'

export interface IUserRepository {
	create(createUserInput: CreateUserInput): Promise<User>
	findOne(id: number): Promise<User>
	delete(id: number): Promise<void>
}
