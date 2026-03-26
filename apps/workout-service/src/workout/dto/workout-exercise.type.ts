import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class WorkoutExerciseType {
    @Field()
    id: string

    @Field()
    name: string

    @Field(() => Float, {nullable: true})
    maxWeight: number

}