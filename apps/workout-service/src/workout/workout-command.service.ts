import { CLIENTS, WORKOUT_PATTERNS } from '@app/contracts'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { firstValueFrom } from 'rxjs'

import { ExerciseService } from '../exercise/exercise.service'

import { AddExerciseInput } from './dto/add-exercise.input'
import { CreateWorkoutInput } from './dto/create-workout.input'
import { WorkoutExercise } from './entities/workout-exercise.entity'
import { WorkoutSet } from './entities/workout-set.entity'
import { Workout } from './entities/workout.entity'
import {
	WorkoutCreatedEvent,
	WorkoutDeletedEvent,
	WorkoutUpdatedEvent
} from './events'
import { WorkoutRepositoryPort } from './repository/workout.repository.abstract'

@Injectable()
export class WorkoutCommandService {
	constructor(
		private readonly workoutRepository: WorkoutRepositoryPort,
		private readonly exerciseService: ExerciseService,
		private readonly eventEmitter: EventEmitter2,
		@Inject(CLIENTS.PARSING_SERVICE) private readonly parsingClient: ClientProxy,
	) {}

	async createWorkout(
		userId: string,
		input: CreateWorkoutInput
	): Promise<Workout> {
		const workout = new Workout()
		workout.userId = userId
		workout.date = input.date
		workout.notes = input.notes

		workout.exercises = await Promise.all(
			input.exercises.map(async (exInput, index) => {
				const exercise = await this.exerciseService.findById(
					exInput.exerciseId
				)

				const we = new WorkoutExercise()
				we.exercise = exercise
				we.orderIndex = index + 1
				we.notes = exInput.notes

				we.sets = exInput.sets.map((setInput, setIdx) => {
					const ws = new WorkoutSet()
					ws.setNumber = setIdx + 1
					ws.weight = setInput.weight
					ws.sets = setInput.sets
					ws.reps = setInput.reps
					return ws
				})

				return we
			})
		)

		const saved = await this.workoutRepository.save(workout)

		this.eventEmitter.emit(
			'workout.created',
			new WorkoutCreatedEvent(
				saved.id,
				saved.userId,
				saved.date,
				saved.exercises.length
			)
		)

		return saved
	}

	async addExercise(
		workoutId: string,
		input: AddExerciseInput
	): Promise<Workout> {
		const workout = await this.getWorkoutOrFail(workoutId)
		const exercise = await this.exerciseService.findById(input.exerciseId)

		const we = new WorkoutExercise()
		we.exercise = exercise
		we.orderIndex = workout.exercises.length + 1
		we.notes = input.notes

		we.sets = input.sets.map((setInput, setIdx) => {
			const ws = new WorkoutSet()
			ws.setNumber = setIdx + 1
			ws.weight = setInput.weight
			ws.sets = setInput.sets
			ws.reps = setInput.reps
			return ws
		})

		workout.exercises.push(we)
		const saved = await this.workoutRepository.save(workout)

		this.eventEmitter.emit(
			'workout.updated',
			new WorkoutUpdatedEvent(saved.id, saved.userId, [
				`added exercise: ${exercise.name}`
			])
		)

		return saved
	}

	async removeExercise(
		workoutId: string,
		exerciseId: number
	): Promise<Workout> {
		const workout = await this.getWorkoutOrFail(workoutId)

		const idx = workout.exercises.findIndex(e => e.id === exerciseId)
		if (idx === -1)
			throw new NotFoundException(
				`Exercise ${exerciseId} not found in workout`
			)

		const removed = workout.exercises.splice(idx, 1)[0]
		const saved = await this.workoutRepository.save(workout)

		this.eventEmitter.emit(
			'workout.updated',
			new WorkoutUpdatedEvent(saved.id, saved.userId, [
				`removed exercise #${removed.orderIndex}`
			])
		)

		return saved
	}

	async deleteWorkout(workoutId: string): Promise<boolean> {
		const workout = await this.getWorkoutOrFail(workoutId)
		const result = await this.workoutRepository.delete(workoutId)

		if (result) {
			this.eventEmitter.emit(
				'workout.deleted',
				new WorkoutDeletedEvent(workout.id, workout.userId)
			)
		}

		return result
	}

	async parseWorkout(userId: string, text: string) {
		return firstValueFrom(
			this.parsingClient.send(WORKOUT_PATTERNS.PARSE, { userId, text }),
		)
	}

	private async getWorkoutOrFail(id: string): Promise<Workout> {
		const workout = await this.workoutRepository.findById(id)
		if (!workout)
			throw new NotFoundException(`Workout with id ${id} not found`)
		return workout
	}
}
