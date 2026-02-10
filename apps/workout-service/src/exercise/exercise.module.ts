import { Module } from '@nestjs/common'

import { ExerciseResolver } from './exercise.resolver'
import { ExerciseService } from './exercise.service'

@Module({
	providers: [ExerciseResolver, ExerciseService]
})
export class ExerciseModule {}
