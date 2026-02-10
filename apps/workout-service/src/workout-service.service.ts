import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkoutServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
