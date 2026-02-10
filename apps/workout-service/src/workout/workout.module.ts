import { Module } from '@nestjs/common'

import { WorkoutResolver } from './workout.resolver'
import { WorkoutService } from './workout.service'

@Module({
	providers: [WorkoutResolver, WorkoutService]
})
export class WorkoutModule {}
