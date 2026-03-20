import { NestFactory } from '@nestjs/core';
import { Logger as NestLogger } from '@nestjs/common';
import { BotServiceModule } from './bot-service.module';
import { BotService } from './bot/bot.service';
import { ENV } from '@app/core';
import { webhookCallback } from 'grammy';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(BotServiceModule);
  const logger = new NestLogger('Bootstrap');

  app.useLogger(app.get(Logger));

  const botService = app.get(BotService)
  await app.listen(ENV.BOT_SERVICE_PORT)
  logger.log(`Bot service listening on port ${ENV.BOT_SERVICE_PORT}`)

  const bot = botService.getBot()

  if( ENV.BOT_WEBHOOK_URL ){
    const expressApp = app.getHttpAdapter().getInstance()
    expressApp.use('/webhook', webhookCallback(bot, 'express'))
    await bot.api.setWebhook(`${ENV.BOT_WEBHOOK_URL}/webhook`)
    logger.log(`Webhook set: ${ENV.BOT_WEBHOOK_URL}/webhook`)
  } else {
    bot.start()
    logger.log('Bot started (long polling)')
  }
}
bootstrap();

