import { Resolver } from '@nestjs/graphql'

import { ExerciseService } from './exercise.service'

@Resolver()
export class ExerciseResolver {
	constructor(private readonly exerciseService: ExerciseService) {}
}
