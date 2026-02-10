import { Module } from '@nestjs/common'

import { WorkoutModule } from '../workout/workout.module'

import { UserResolver } from './resolvers/user.resolver'

@Module({
	imports: [WorkoutModule],
	providers: [UserResolver]
})
export class CommonModule {}
