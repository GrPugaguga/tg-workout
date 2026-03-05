import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParsedSetType {
	@Field(() => Int)
	sets!: number

	@Field(() => Int, { nullable: true })
	reps?: number

	@Field(() => Float, { nullable: true })
	weight?: number

	@Field(() => Int, { nullable: true })
	duration?: number
}

@ObjectType()
export class ParsedExerciseType {
	@Field()
	exerciseId!: string

	@Field()
	exerciseName!: string

	@Field({ nullable: true })
	equipmentId?: string

	@Field({ nullable: true })
	equipmentName?: string

	@Field(() => [ParsedSetType])
	sets!: ParsedSetType[]
}

@ObjectType()
export class ParsedWorkoutResultType {
	@Field(() => [ParsedExerciseType])
	exercises!: ParsedExerciseType[]
}
