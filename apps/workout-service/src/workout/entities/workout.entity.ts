import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { WorkoutExercise } from './workout-exercise.entity'

@ObjectType()
@Entity({ name: 'workouts' })
export class Workout {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Field()
	@Column()
	userId!: string

	@Field(() => String)
	@Column({ type: 'date' })
	date!: string

	@Field({ nullable: true })
	@Column({ nullable: true })
	notes?: string

	@Field(() => [WorkoutExercise])
	@OneToMany(() => WorkoutExercise, we => we.workout, { cascade: true })
	exercises!: WorkoutExercise[]

	@Field()
	@CreateDateColumn()
	createdAt!: Date

	@Field()
	@UpdateDateColumn()
	updatedAt!: Date
}
