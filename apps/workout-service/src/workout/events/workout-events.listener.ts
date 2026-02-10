import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { logger } from '../../main'

import { WorkoutCreatedEvent } from './workout-created.event'
import { WorkoutDeletedEvent } from './workout-deleted.event'
import { WorkoutUpdatedEvent } from './workout-updated.event'

@Injectable()
export class WorkoutEventsListener {
	@OnEvent('workout.created')
	handleCreated(event: WorkoutCreatedEvent) {
		logger.info(
			{ workoutId: event.workoutId, userId: event.userId },
			'Workout created'
		)
	}

	@OnEvent('workout.updated')
	handleUpdated(event: WorkoutUpdatedEvent) {
		logger.info(
			{
				workoutId: event.workoutId,
				userId: event.userId,
				changes: event.changes
			},
			'Workout updated'
		)
	}

	@OnEvent('workout.deleted')
	handleDeleted(event: WorkoutDeletedEvent) {
		logger.info(
			{ workoutId: event.workoutId, userId: event.userId },
			'Workout deleted'
		)
	}
}
