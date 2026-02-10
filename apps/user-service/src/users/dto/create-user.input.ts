import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

@InputType()
export class CreateUserInput {
	@IsNumber()
	@IsPositive()
	@Field(() => Int, { description: 'Telegram ID' })
	telegramId!: number

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	username?: string

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	firstName?: string

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	lastName?: string
}
