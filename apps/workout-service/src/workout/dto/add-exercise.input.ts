import { CreateWorkoutSetInput } from '@app/contracts'
import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested
} from 'class-validator'


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
