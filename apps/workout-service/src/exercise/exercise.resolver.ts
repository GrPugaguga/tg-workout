import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateExerciseInput } from './dto/create-exercise.input'
import { UpdateExerciseInput } from './dto/update-exercise.input'
import { Equipment } from './entities/equipment.entity'
import { Exercise } from './entities/exercise.entity'
import { MuscleGroup } from './entities/muscle-group.entity'
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

	@Query(() => [MuscleGroup], { name: 'muscleGroups' })
	findAllMuscleGroups() {
		return this.exerciseService.findAllMuscleGroups()
	}

	@Query(() => [Equipment], { name: 'equipment' })
	findAllEquipment() {
		return this.exerciseService.findAllEquipment()
	}

	@Mutation(() => Exercise)
	createExercise(@Args('input') input: CreateExerciseInput) {
		return this.exerciseService.create(input)
	}

	@Mutation(() => Exercise)
	updateExercise(@Args('input') input: UpdateExerciseInput) {
		return this.exerciseService.update(input)
	}

	@Mutation(() => ID)
	deleteExercise(@Args('id', { type: () => ID }) id: string) {
		return this.exerciseService.delete(id)
	}
}
