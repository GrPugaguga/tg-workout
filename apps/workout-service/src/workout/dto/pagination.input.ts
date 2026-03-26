import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator'

export enum SortEnum {asc = 'asc', desc = 'desc'}
registerEnumType(SortEnum, {name: 'SortEnum'})

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

	@IsOptional()
	@IsEnum(SortEnum)
	@Field(() => SortEnum, { defaultValue: SortEnum.desc})
	sort: SortEnum = SortEnum.desc
}
