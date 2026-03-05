import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { ExerciseDocument, EquipmentDocument } from '@app/typesense'

import { SyncServiceService } from './sync-service.service'
import { EXERCISE_PATTERNS, EQUIPMENT_PATTERNS } from '@app/contracts'

@Controller()
export class SyncServiceController {
	constructor(private readonly syncServiceService: SyncServiceService) {}

	// --- Exercise events ---

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

	// --- Equipment events ---

	@EventPattern(EQUIPMENT_PATTERNS.CREATED)
	handleEquipmentCreated(@Payload() equipment: EquipmentDocument[]) {
		return this.syncServiceService.createEquipment(equipment)
	}

	@EventPattern(EQUIPMENT_PATTERNS.UPDATED)
	handleEquipmentUpdated(@Payload() equipment: EquipmentDocument[]) {
		return this.syncServiceService.updateEquipment(equipment)
	}

	@EventPattern(EQUIPMENT_PATTERNS.DELETED)
	handleEquipmentDeleted(@Payload() ids: string[]) {
		return this.syncServiceService.deleteEquipment(ids)
	}
}
