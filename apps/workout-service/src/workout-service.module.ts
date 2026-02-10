import { Module } from '@nestjs/common';
import { WorkoutServiceController } from './workout-service.controller';
import { WorkoutServiceService } from './workout-service.service';

@Module({
  imports: [],
  controllers: [WorkoutServiceController],
  providers: [WorkoutServiceService],
})
export class WorkoutServiceModule {}
