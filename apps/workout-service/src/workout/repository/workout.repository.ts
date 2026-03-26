import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Workout } from '../entities/workout.entity'

import { WorkoutRepositoryPort } from './workout.repository.abstract'
import { PaginationInput } from '../dto/pagination.input'

const WORKOUT_RELATIONS = [
	'exercises',
	'exercises.exercise',
	'exercises.equipment',
	'exercises.sets'
]

@Injectable()
export class WorkoutRepository extends WorkoutRepositoryPort {
	constructor(@InjectRepository(Workout) private repo: Repository<Workout>) {
		super()
	}

	async findById(id: string): Promise<Workout | null> {
		return this.repo.findOne({
			where: { id },
			relations: WORKOUT_RELATIONS
		})
	}

	async findByUserId(
		userId: string,
		options?: Partial<PaginationInput>
	): Promise<Workout[]> {
		return this.repo.find({
			where: { userId },
			relations: WORKOUT_RELATIONS,
			order: { date: options?.sort ?? 'DESC', exercises: { orderIndex: 'ASC' } },
			skip: options?.skip,
			take: options?.take
		})
	}

	async findByUserIdAndDate(
		userId: string,
		date: Date
	): Promise<Workout | null> {
		return this.repo.findOne({
			where: { userId, date },
			relations: WORKOUT_RELATIONS
		})
	}

	async countByUserId(userId: string): Promise<number> {
		return this.repo.count({
			where: {userId}
		})
	}

	async save(workout: Workout): Promise<Workout> {
		return this.repo.save(workout)
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.repo.delete(id)
		return (result.affected ?? 0) > 0
	}
}
