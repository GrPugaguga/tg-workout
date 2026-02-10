export class WorkoutUpdatedEvent {
	constructor(
		public readonly workoutId: string,
		public readonly userId: string,
		public readonly changes: string[],
		public readonly occurredAt: Date = new Date()
	) {}
}
