import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json'


@ObjectType()
export class AiResponseType {
    @Field()
    message!: string

    @Field()
    intent!: string

    @Field(() => GraphQLJSON, { nullable: true })
    data?: unknown   
}