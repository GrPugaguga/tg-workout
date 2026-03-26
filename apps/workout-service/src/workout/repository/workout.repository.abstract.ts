import { PaginationInput } from '../dto/pagination.input';
import { WorkoutHistoryItem } from '../dto/workout-exercise-history.type';
import { WorkoutExerciseType } from '../dto/workout-exercise.type';
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
	abstract getUserExercisesList(
		userId: string,
		options?: Pick<PaginationInput,'sort'>
	): Promise<WorkoutExerciseType[]>
	abstract getUserExerciseHistory(
		userId: string,
		exercise: string
	): Promise<WorkoutHistoryItem[]>
	abstract save(workout: Workout): Promise<Workout>
	abstract delete(id: string): Promise<boolean>
}
