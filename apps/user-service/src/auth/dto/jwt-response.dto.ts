import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class JwtResponseDto {
    @Field()
    accessToken!:string

  @Field(() => Int)
    expiredAt!: number
}