import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested
} from 'class-validator'

import { CreateWorkoutSetInput } from './create-workout.input'

@InputType()
export class AddExerciseInput {
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
