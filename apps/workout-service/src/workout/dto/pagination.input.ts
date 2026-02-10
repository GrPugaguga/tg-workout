import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

@InputType()
export class PaginationInput {
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Field(() => Int, { defaultValue: 0 })
	skip: number = 0

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(100)
	@Field(() => Int, { defaultValue: 20 })
	take: number = 20
}
