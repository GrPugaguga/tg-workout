import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { Equipment } from './equipment.entity'
import { MuscleGroup } from './muscle-group.entity'

@ObjectType()
@Entity({ name: 'exercises' })
export class Exercise {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Field()
	@Column({ unique: true })
	name!: string

	@Field()
	@Column()
	description!: string

	@Field(() => [String], { nullable: true })
	@Column('text', { array: true, nullable: true })
	aliases?: string[]

	@Field(() => [MuscleGroup])
	@ManyToMany(() => MuscleGroup)
	@JoinTable()
	muscleGroups!: MuscleGroup[]

	@Field(() => [Equipment])
	@ManyToMany(() => Equipment)
	@JoinTable()
	equipment!: Equipment[]

	@Field()
	@CreateDateColumn()
	createdAt!: Date

	@Field()
	@UpdateDateColumn()
	updatedAt!: Date
}
