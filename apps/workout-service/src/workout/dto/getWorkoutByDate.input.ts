import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";

@InputType()
export class DateInput {
    @IsDate()
    @Type(() => Date)
    @Field()
    date: Date
}