import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutServiceController } from './workout-service.controller';
import { WorkoutServiceService } from './workout-service.service';

describe('WorkoutServiceController', () => {
  let workoutServiceController: WorkoutServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutServiceController],
      providers: [WorkoutServiceService],
    }).compile();

    workoutServiceController = app.get<WorkoutServiceController>(WorkoutServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workoutServiceController.getHello()).toBe('Hello World!');
    });
  });
});
