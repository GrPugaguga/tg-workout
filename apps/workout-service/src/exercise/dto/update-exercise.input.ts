import { Field, ID, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateExerciseInput {
	@IsString()
	@Field(() => ID)
	id!: string

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	name?: string

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	description?: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Field(() => [String], { nullable: true })
	aliases?: string[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Field(() => [String], { nullable: true })
	muscleGroupIds?: string[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Field(() => [String], { nullable: true })
	equipmentIds?: string[]
}
