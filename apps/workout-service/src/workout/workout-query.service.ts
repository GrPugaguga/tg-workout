import { Injectable, NotFoundException } from '@nestjs/common'

import { PaginationInput } from './dto/pagination.input'
import { Workout } from './entities/workout.entity'
import { WorkoutRepositoryPort } from './repository/workout.repository.abstract'
import { WorkoutType } from './dto/workout.type'
import { WorkoutDates } from './dto/getWorkoutDates.type'

@Injectable()
export class WorkoutQueryService {
	constructor(private readonly workoutRepository: WorkoutRepositoryPort) {}

	async getWorkout(id: string): Promise<Workout> {
		const workout = await this.workoutRepository.findById(id)
		if (!workout)
			throw new NotFoundException(`Workout with id ${id} not found`)
		return workout
	}

	async getUserWorkouts(
		userId: string,
		pagination: Partial<PaginationInput>
	): Promise<WorkoutType> {
		const workouts = await this.workoutRepository.findByUserId(userId, {
			skip: pagination.skip,
			take: pagination.take,
			sort: pagination.sort
		})

		const total = await this.workoutRepository.countByUserId(userId)

		return {
			items: workouts,
			total,
			hasMore: (pagination?.skip ?? 0) + workouts.length < total
		}
	}

	async getUserWorkoutByDay (
		userId: string,
		date: Date
	): Promise<WorkoutType> {
		const workouts = await this.workoutRepository.findByUserIdAndDate(userId, date)

		return {
			items: workouts,
			total: workouts.length,
			hasMore: false 
		}
	}

	async getUserWorkoutDates (
		userId: string
	): Promise<WorkoutDates> {
		return {dates: await this.workoutRepository.getWorkoutDatesByUserId(userId)}
	}

}
