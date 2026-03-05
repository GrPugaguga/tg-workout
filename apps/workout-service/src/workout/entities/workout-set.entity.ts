import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique
} from 'typeorm'

import { WorkoutExercise } from './workout-exercise.entity'

@ObjectType()
@Entity({ name: 'workout_sets' })
@Unique(['workoutExercise', 'setNumber'])
export class WorkoutSet {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => WorkoutExercise, we => we.sets, { onDelete: 'CASCADE' })
	workoutExercise!: WorkoutExercise

	@Field(() => Int)
	@Column()
	setNumber!: number

	@Field(() => Float, { nullable: true })
	@Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
	weight?: number

	@Field(() => Int)
	@Column({ default: 1 })
	sets!: number

	@Field(() => Int, { nullable: true })
	@Column({ nullable: true })
	reps?: number

	@Field(() => Int, { nullable: true })
	@Column({ nullable: true })
	duration?: number
}
