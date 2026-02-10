import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateExerciseInput {
	@IsString()
	@Field()
	name!: string

	@IsString()
	@Field()
	description!: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Field(() => [String], { nullable: true })
	aliases?: string[]

	@IsArray()
	@IsString({ each: true })
	@Field(() => [String])
	muscleGroupIds!: string[]

	@IsArray()
	@IsString({ each: true })
	@Field(() => [String])
	equipmentIds!: string[]
}
