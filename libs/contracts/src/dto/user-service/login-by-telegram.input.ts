import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class LoginByTelegramDto {
    @Field(() => Int)
    telegramId!: number

    @Field()
    botSecret!: string
}