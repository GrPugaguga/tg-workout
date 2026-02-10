import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { PaginationInput } from '../../workout/dto/pagination.input'
import { Workout } from '../../workout/entities/workout.entity'
import { WorkoutQueryService } from '../../workout/workout-query.service'
import { User } from '../entities/user.reference'

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly workoutQueryService: WorkoutQueryService) {}

	@ResolveField(() => [Workout])
	workouts(@Parent() user: User) {
		return this.workoutQueryService.getUserWorkouts(
			user.id,
			new PaginationInput()
		)
	}
}
