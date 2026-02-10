import { Controller, Get } from '@nestjs/common';
import { WorkoutServiceService } from './workout-service.service';

@Controller()
export class WorkoutServiceController {
  constructor(private readonly workoutServiceService: WorkoutServiceService) {}

  @Get()
  getHello(): string {
    return this.workoutServiceService.getHello();
  }
}
