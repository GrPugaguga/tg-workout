import { Field, ID, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TelegramId } from '../value-objects/telegramId.value-object';
import { TelegramIdTransformer } from '../value-objects/telegramId.transformer';


@Entity({name: 'users'})
export class User{
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Field(() => Int, {nullable: false})
    @Column({
      unique: true,
      type: 'bigint',
      transformer: TelegramIdTransformer
    })
    telegramId!: TelegramId

    @Field({nullable: true})
    @Column()
    username?: string;

    @Field({nullable: true})
    @Column()
    firstName?: string;

    @Field({nullable: true})
    @Column()
    lastName?: string;

    @Field(() => Int, {description: 'Created at'})
    @CreateDateColumn()
    createdAt?: Date 

    @Field(() => Int, {description: 'Updated at'})
    @UpdateDateColumn()
    updatedAt?: Date
}