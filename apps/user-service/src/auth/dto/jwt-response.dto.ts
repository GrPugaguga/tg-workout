import { Field, Int } from "@nestjs/graphql";

export class JwtResponseDto {
    @Field()
    accessToken!:string

  @Field(() => Int)
    expiredAt!: number
}