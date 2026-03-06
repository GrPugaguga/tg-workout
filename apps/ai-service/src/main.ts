import { NestFactory } from '@nestjs/core';
import { AiServiceModule } from './ai-service.module';
import { ENV } from '@app/core';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { QUEUES } from '@app/contracts/queues';

async function bootstrap() {
  const app = await NestFactory.create(AiServiceModule);

  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [ENV.RABBITMQ_URL],
      queue: QUEUES.AI,
      queueOptions: { durable: true },
    }
  })

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(ENV.AI_SERVICE_PORT);
}
bootstrap();
