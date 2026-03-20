import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class JwtResponseDto {
    @Field()
    accessToken!: string

    @Field(() => Float)
    expiredAt!: number
}
