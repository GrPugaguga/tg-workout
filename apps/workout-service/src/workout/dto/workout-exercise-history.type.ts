import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { WorkoutExerciseType } from "./workout-exercise.type";

@ObjectType()
class WorkoutSetType  {
    @Field(() => Int)
    setNumber: number

    @Field(() => Float,{ nullable: true })
    weight: number
    
    @Field(() => Int,{ nullable: true })
    reps: number

    @Field(() => Int,{ nullable: true })
    sets: number
}

@ObjectType()
export class WorkoutHistoryItem {
    @Field()
    date: string

    @Field(() => Float, {nullable: true})
    maxWeight!: number

    @Field(() => [WorkoutSetType])
    sets!: WorkoutSetType[]
}

@ObjectType()
export class WorkoutExerciseHistoryType extends WorkoutExerciseType{
    @Field(() => [WorkoutHistoryItem])
    history: WorkoutHistoryItem[]
}