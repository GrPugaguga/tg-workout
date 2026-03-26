import { PaginationInput } from '../dto/pagination.input';
import { Workout } from '../entities/workout.entity'

export abstract class WorkoutRepositoryPort {
	abstract findById(id: string): Promise<Workout | null>
	abstract findByUserId(
		userId: string,
		options?: Partial<PaginationInput>
	): Promise<Workout[]>
	abstract findByUserIdAndDate(
		userId: string,
		date: Date
	): Promise<Workout[]>
	abstract getWorkoutDatesByUserId (userId: string): Promise<string[]>
	abstract countByUserId(userId: string): Promise<number>
	abstract save(workout: Workout): Promise<Workout>
	abstract delete(id: string): Promise<boolean>
}
