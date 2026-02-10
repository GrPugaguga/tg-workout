import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { UserRepository } from './repository/user.repository'
import { UserRepositoryPort } from './repository/user.repository.abstract'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [
		UsersResolver,
		UsersService,
		{
			provide: UserRepositoryPort,
			useClass: UserRepository
		}
	],
	exports: [UsersService]
})
export class UsersModule {}
