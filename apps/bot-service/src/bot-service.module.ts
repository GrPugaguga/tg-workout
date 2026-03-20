import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { HealthModule } from './health/health.module';
import { createLoggerModule } from '@app/utils';

@Module({
  imports: [
    createLoggerModule('bot-service'),
    BotModule, 
    HealthModule]
})
export class BotServiceModule {}
