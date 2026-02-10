import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql'
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { TelegramIdTransformer } from '../value-objects/telegramId.transformer'
import { TelegramId } from '../value-objects/telegramId.value-object'

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'users' })
export class User {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Field(() => Int, { nullable: false })
	@Column({
		unique: true,
		type: 'bigint',
		transformer: TelegramIdTransformer
	})
	telegramId!: TelegramId

	@Field({ nullable: true })
	@Column({ nullable: true })
	username?: string

	@Field({ nullable: true })
	@Column({ nullable: true })
	firstName?: string

	@Field({ nullable: true })
	@Column({ nullable: true })
	lastName?: string

	@Field(() => Int, { description: 'Created at' })
	@CreateDateColumn()
	createdAt?: Date

	@Field(() => Int, { description: 'Updated at' })
	@UpdateDateColumn()
	updatedAt?: Date
}
