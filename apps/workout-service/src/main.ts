import { NestFactory } from '@nestjs/core';
import { WorkoutServiceModule } from './workout-service.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkoutServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
