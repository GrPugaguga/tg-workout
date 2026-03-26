import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Workout } from "../entities";

@ObjectType()
export class WorkoutType {
    @Field(() => [Workout])
    items: Workout[]

    @Field(() => Int)
    total: number

    @Field()
    hasMore: boolean
}