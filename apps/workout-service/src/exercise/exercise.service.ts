import { Injectable, NotFoundException } from '@nestjs/common'

import { Exercise } from './entities/exercise.entity'
import { ExerciseRepositoryPort } from './repository/exercise.repository.abstract'

@Injectable()
export class ExerciseService {
	constructor(private readonly exerciseRepository: ExerciseRepositoryPort) {}

	async findById(id: string): Promise<Exercise> {
		const exercise = await this.exerciseRepository.findById(id)
		if (!exercise)
			throw new NotFoundException(`Exercise with id ${id} not found`)
		return exercise
	}

	async findAll(): Promise<Exercise[]> {
		return this.exerciseRepository.findAll()
	}

	async search(query: string): Promise<Exercise[]> {
		return this.exerciseRepository.search(query)
	}
}
