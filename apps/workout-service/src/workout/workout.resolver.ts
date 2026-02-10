import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AddExerciseInput } from './dto/add-exercise.input'
import { CreateWorkoutInput } from './dto/create-workout.input'
import { PaginationInput } from './dto/pagination.input'
import { Workout } from './entities/workout.entity'
import { WorkoutCommandService } from './workout-command.service'
import { WorkoutQueryService } from './workout-query.service'

@Resolver(() => Workout)
export class WorkoutResolver {
	constructor(
		private readonly commandService: WorkoutCommandService,
		private readonly queryService: WorkoutQueryService
	) {}

	@Query(() => Workout, { name: 'workout' })
	getWorkout(@Args('id', { type: () => ID }) id: string) {
		return this.queryService.getWorkout(id)
	}

	@Query(() => [Workout], { name: 'myWorkouts' })
	getMyWorkouts(
		@Args('userId') userId: string,
		@Args('pagination', { nullable: true })
		pagination: PaginationInput = new PaginationInput()
	) {
		return this.queryService.getUserWorkouts(userId, pagination)
	}

	@Mutation(() => Workout)
	createWorkout(
		@Args('userId') userId: string,
		@Args('input') input: CreateWorkoutInput
	) {
		return this.commandService.createWorkout(userId, input)
	}

	@Mutation(() => Workout)
	addExercise(
		@Args('workoutId', { type: () => ID }) workoutId: string,
		@Args('input') input: AddExerciseInput
	) {
		return this.commandService.addExercise(workoutId, input)
	}

	@Mutation(() => Workout)
	removeExercise(
		@Args('workoutId', { type: () => ID }) workoutId: string,
		@Args('exerciseId', { type: () => Int }) exerciseId: number
	) {
		return this.commandService.removeExercise(workoutId, exerciseId)
	}

	@Mutation(() => Boolean)
	deleteWorkout(@Args('id', { type: () => ID }) id: string) {
		return this.commandService.deleteWorkout(id)
	}
}
