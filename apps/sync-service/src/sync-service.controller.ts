import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { ExerciseDocument } from '@app/typesense'

import { SyncServiceService } from './sync-service.service'
import { EXERCISE_PATTERNS } from '@app/contracts'

@Controller()
export class SyncServiceController {
	constructor(private readonly syncServiceService: SyncServiceService) {}

	@EventPattern(EXERCISE_PATTERNS.CREATED)
	handleExercisesCreated(@Payload() exercises: ExerciseDocument[]) {
		return this.syncServiceService.create(exercises)
	}

	@EventPattern(EXERCISE_PATTERNS.UPDATED)
	handleExercisesUpdated(@Payload() exercises: ExerciseDocument[]) {
		return this.syncServiceService.update(exercises)
	}

	@EventPattern(EXERCISE_PATTERNS.DELETED)
	handleExercisesDeleted(@Payload() ids: string[]) {
		return this.syncServiceService.delete(ids)
	}
}
