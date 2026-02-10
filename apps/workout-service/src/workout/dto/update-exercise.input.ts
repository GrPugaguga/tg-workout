import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateExerciseInput {
	@IsOptional()
	@IsNumber()
	@Field(() => Float, { nullable: true })
	weight?: number

	@IsOptional()
	@IsNumber()
	@Field(() => Int, { nullable: true })
	sets?: number

	@IsOptional()
	@IsNumber()
	@Field(() => Int, { nullable: true })
	reps?: number

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	notes?: string
}
