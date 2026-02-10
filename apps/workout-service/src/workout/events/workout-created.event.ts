export class WorkoutCreatedEvent {
	constructor(
		public readonly workoutId: string,
		public readonly userId: string,
		public readonly date: Date,
		public readonly exerciseCount: number,
		public readonly occurredAt: Date = new Date()
	) {}
}
