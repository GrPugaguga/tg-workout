import { AuthenticatedGuard, CurrentUser, FederationUser } from '@app/core'
import { UseGuards } from '@nestjs/common'
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AddExerciseInput } from './dto/add-exercise.input'
import { CreateWorkoutInput } from './dto/create-workout.input'
import { PaginationInput } from './dto/pagination.input'
import { ParsedWorkoutResultType } from './dto/parsed-workout-result.type'
import { Workout } from './entities/workout.entity'
import { WorkoutCommandService } from './workout-command.service'
import { WorkoutQueryService } from './workout-query.service'

@Resolver(() => Workout)
export class WorkoutResolver {
	constructor(
		private readonly commandService: WorkoutCommandService,
		private readonly queryService: WorkoutQueryService
	) {}

	@UseGuards(AuthenticatedGuard)
	@Query(() => Workout, { name: 'workout' })
	getWorkout(@Args('id', { type: () => ID }) id: string) {
		return this.queryService.getWorkout(id)
	}

	@UseGuards(AuthenticatedGuard)
	@Query(() => [Workout], { name: 'myWorkouts' })
	getMyWorkouts(
		@CurrentUser() user: FederationUser,
		@Args('pagination', { nullable: true })
		pagination: PaginationInput = new PaginationInput()
	) {
		return this.queryService.getUserWorkouts(user.id, pagination)
	}

	@UseGuards(AuthenticatedGuard)
	@Mutation(() => Workout)
	createWorkout(
		@CurrentUser() user: FederationUser,
		@Args('input') input: CreateWorkoutInput
	) {
		return this.commandService.createWorkout(user.id, input)
	}

	@UseGuards(AuthenticatedGuard)
	@Mutation(() => Workout)
	addExercise(
		@Args('workoutId', { type: () => ID }) workoutId: string,
		@Args('input') input: AddExerciseInput
	) {
		return this.commandService.addExercise(workoutId, input)
	}

	@UseGuards(AuthenticatedGuard)
	@Mutation(() => Workout)
	removeExercise(
		@Args('workoutId', { type: () => ID }) workoutId: string,
		@Args('exerciseId', { type: () => Int }) exerciseId: number
	) {
		return this.commandService.removeExercise(workoutId, exerciseId)
	}

	@UseGuards(AuthenticatedGuard)
	@Mutation(() => Boolean)
	deleteWorkout(@Args('id', { type: () => ID }) id: string) {
		return this.commandService.deleteWorkout(id)
	}

	@UseGuards(AuthenticatedGuard)
	@Mutation(() => ParsedWorkoutResultType)
	parseWorkout(
		@CurrentUser() user: FederationUser,
		@Args('text') text: string,
	) {
		return this.commandService.parseWorkout(user.id, text)
	}
}
