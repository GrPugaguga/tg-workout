import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { WorkoutCreatedEvent } from './workout-created.event'
import { WorkoutDeletedEvent } from './workout-deleted.event'
import { WorkoutUpdatedEvent } from './workout-updated.event'

@Injectable()
export class WorkoutEventsListener {
	private readonly logger = new Logger(WorkoutEventsListener.name)

	@OnEvent('workout.created')
	handleCreated(event: WorkoutCreatedEvent) {
		this.logger.log(
			`Workout created: ${event.workoutId} by ${event.userId}`
		)
	}

	@OnEvent('workout.updated')
	handleUpdated(event: WorkoutUpdatedEvent) {
		this.logger.log(
			`Workout updated: ${event.workoutId} by ${event.userId}`
		)
	}

	@OnEvent('workout.deleted')
	handleDeleted(event: WorkoutDeletedEvent) {
		this.logger.log(
			`Workout deleted: ${event.workoutId} by ${event.userId}`
		)
	}
}
