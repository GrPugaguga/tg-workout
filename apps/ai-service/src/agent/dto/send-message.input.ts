import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
    @Field()
    text!: string;
}

