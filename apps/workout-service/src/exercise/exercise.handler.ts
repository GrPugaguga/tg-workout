import { ExerciseDocument } from '@app/typesense'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

import { ExerciseService } from './exercise.service'
import { EXERCISE_PATTERNS } from '@app/contracts'

@Controller()
export class ExerciseHandler {
	constructor(private readonly exerciseService: ExerciseService) {}

	@MessagePattern(EXERCISE_PATTERNS.GET_ALL)
	async handleGetAll(): Promise<ExerciseDocument[]> {
		const exercises = await this.exerciseService.findAll()
		return exercises.map(e => ({
			id: e.id,
			name: e.name,
			description: e.description,
			aliases: e.aliases ?? [],
			muscleGroups: e.muscleGroups.map(mg => mg.name),
			equipment: e.equipment.map(eq => eq.name),
		}))
	}
}
