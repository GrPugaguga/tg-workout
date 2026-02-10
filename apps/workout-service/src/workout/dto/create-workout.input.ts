import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsDate,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested
} from 'class-validator'

@InputType()
export class CreateWorkoutSetInput {
	@IsNumber()
	@Field(() => Float)
	weight!: number

	@IsNumber()
	@Field(() => Int, { defaultValue: 1 })
	sets: number = 1

	@IsNumber()
	@Field(() => Int)
	reps!: number
}

@InputType()
export class CreateWorkoutExerciseInput {
	@IsUUID()
	@Field()
	exerciseId!: string

	@IsOptional()
	@IsUUID()
	@Field({ nullable: true })
	equipmentId?: string

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	notes?: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateWorkoutSetInput)
	@Field(() => [CreateWorkoutSetInput])
	sets!: CreateWorkoutSetInput[]
}

@InputType()
export class CreateWorkoutInput {
	@IsDate()
	@Type(() => Date)
	@Field()
	date!: Date

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	notes?: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateWorkoutExerciseInput)
	@Field(() => [CreateWorkoutExerciseInput])
	exercises!: CreateWorkoutExerciseInput[]
}
