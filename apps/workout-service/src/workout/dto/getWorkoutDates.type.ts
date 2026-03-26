import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class WorkoutDates{
    @Field(() => [String])
    dates: string[]
}