import { Injectable, NotFoundException } from '@nestjs/common'

import { PaginationInput } from './dto/pagination.input'
import { Workout } from './entities/workout.entity'
import { WorkoutRepositoryPort } from './repository/workout.repository.abstract'

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
		pagination: PaginationInput
	): Promise<Workout[]> {
		return this.workoutRepository.findByUserId(userId, {
			skip: pagination.skip,
			take: pagination.take
		})
	}
}
