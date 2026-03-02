import { Exercise } from '../entities/exercise.entity'

export abstract class ExerciseRepositoryPort {
	abstract findById(id: string): Promise<Exercise | null>
	abstract findByName(name: string): Promise<Exercise | null>
	abstract findByAlias(alias: string): Promise<Exercise | null>
	abstract search(query: string): Promise<Exercise[]>
	abstract findAll(): Promise<Exercise[]>
	abstract save(exercise: Exercise): Promise<Exercise>
	abstract delete(id: string): Promise<void>
}
