import { Workout } from '../entities/workout.entity'

export abstract class WorkoutRepositoryPort {
	abstract findById(id: string): Promise<Workout | null>
	abstract findByUserId(
		userId: string,
		options?: { skip?: number; take?: number }
	): Promise<Workout[]>
	abstract findByUserIdAndDate(
		userId: string,
		date: Date
	): Promise<Workout | null>
	abstract save(workout: Workout): Promise<Workout>
	abstract delete(id: string): Promise<boolean>
}
