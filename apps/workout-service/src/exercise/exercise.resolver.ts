import { Args, ID, Query, Resolver } from '@nestjs/graphql'

import { Exercise } from './entities/exercise.entity'
import { ExerciseService } from './exercise.service'

@Resolver(() => Exercise)
export class ExerciseResolver {
	constructor(private readonly exerciseService: ExerciseService) {}

	@Query(() => Exercise, { name: 'exercise' })
	findOne(@Args('id', { type: () => ID }) id: string) {
		return this.exerciseService.findById(id)
	}

	@Query(() => [Exercise], { name: 'exercises' })
	findAll() {
		return this.exerciseService.findAll()
	}

	@Query(() => [Exercise], { name: 'searchExercises' })
	search(@Args('query') query: string) {
		return this.exerciseService.search(query)
	}
}
