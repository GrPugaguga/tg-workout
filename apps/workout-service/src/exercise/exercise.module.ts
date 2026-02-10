import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Equipment } from './entities/equipment.entity'
import { Exercise } from './entities/exercise.entity'
import { MuscleGroup } from './entities/muscle-group.entity'
import { ExerciseResolver } from './exercise.resolver'
import { ExerciseService } from './exercise.service'
import { ExerciseRepository } from './repository/exercise.repository'
import { ExerciseRepositoryPort } from './repository/exercise.repository.abstract'

@Module({
	imports: [TypeOrmModule.forFeature([Exercise, MuscleGroup, Equipment])],
	providers: [
		ExerciseResolver,
		ExerciseService,
		{
			provide: ExerciseRepositoryPort,
			useClass: ExerciseRepository
		}
	],
	exports: [ExerciseService]
})
export class ExerciseModule {}
