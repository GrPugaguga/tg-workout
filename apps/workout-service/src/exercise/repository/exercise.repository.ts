import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Exercise } from '../entities/exercise.entity'

import { ExerciseRepositoryPort } from './exercise.repository.abstract'

@Injectable()
export class ExerciseRepository extends ExerciseRepositoryPort {
	constructor(
		@InjectRepository(Exercise) private repo: Repository<Exercise>
	) {
		super()
	}

	async findById(id: string): Promise<Exercise | null> {
		return this.repo.findOne({
			where: { id },
			relations: ['muscleGroups', 'equipment']
		})
	}

	async findByName(name: string): Promise<Exercise | null> {
		return this.repo.findOne({
			where: { name },
			relations: ['muscleGroups', 'equipment']
		})
	}

	async findByAlias(alias: string): Promise<Exercise | null> {
		return this.repo
			.createQueryBuilder('exercise')
			.leftJoinAndSelect('exercise.muscleGroups', 'muscleGroup')
			.leftJoinAndSelect('exercise.equipment', 'equipment')
			.where(':alias = ANY(exercise.aliases)', { alias })
			.getOne()
	}

	async search(query: string): Promise<Exercise[]> {
		return this.repo
			.createQueryBuilder('exercise')
			.leftJoinAndSelect('exercise.muscleGroups', 'muscleGroup')
			.leftJoinAndSelect('exercise.equipment', 'equipment')
			.where('exercise.name ILIKE :query', { query: `%${query}%` })
			.orWhere('exercise.aliases::text ILIKE :query', {
				query: `%${query}%`
			})
			.getMany()
	}

	async findAll(): Promise<Exercise[]> {
		return this.repo.find({
			relations: ['muscleGroups', 'equipment']
		})
	}

	async save(exercise: Exercise): Promise<Exercise> {
		return this.repo.save(exercise)
	}
}
