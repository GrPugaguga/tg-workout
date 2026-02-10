export class WorkoutDeletedEvent {
	constructor(
		public readonly workoutId: string,
		public readonly userId: string,
		public readonly occurredAt: Date = new Date()
	) {}
}
