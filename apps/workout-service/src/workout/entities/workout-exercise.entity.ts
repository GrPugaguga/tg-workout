import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'

import { Equipment } from '../../exercise/entities/equipment.entity'
import { Exercise } from '../../exercise/entities/exercise.entity'

import { WorkoutSet } from './workout-set.entity'
import { Workout } from './workout.entity'

@ObjectType()
@Entity({ name: 'workout_exercises' })
export class WorkoutExercise {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => Workout, w => w.exercises, { onDelete: 'CASCADE' })
	workout!: Workout

	@Field(() => Exercise)
	@ManyToOne(() => Exercise)
	exercise!: Exercise

	@Field(() => Float, {nullable: true})
	@Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
	maxWeight!: number

	@Field(() => Equipment, { nullable: true })
	@ManyToOne(() => Equipment, { nullable: true })
	equipment?: Equipment

	@Field(() => Int)
	@Column()
	orderIndex!: number

	@Field({ nullable: true })
	@Column({ nullable: true })
	notes?: string

	@Field(() => [WorkoutSet])
	@OneToMany(() => WorkoutSet, s => s.workoutExercise, { cascade: true })
	sets!: WorkoutSet[]
}
