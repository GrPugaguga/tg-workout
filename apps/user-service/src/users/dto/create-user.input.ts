import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput{
  @Field(() => Int, {description: 'Telegram ID'})
  telegramId!: number
  
  @Field({nullable: true})
  username?: string;

  @Field({nullable: true})
  firstName?: string;

  @Field({nullable: true})
  lastName?: string;
}
