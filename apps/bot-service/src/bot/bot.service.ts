import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { GatewayClientService } from "../gateway-client/gateway-client.service";
import { Bot, InlineKeyboard } from 'grammy'
import { ENV } from "@app/core";
import { CreateWorkoutInput } from "@app/contracts";

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy{
    private readonly logger = new Logger(BotService.name)
    private bot!: Bot

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private gatewayClient: GatewayClientService
    ){}

    getBot(): Bot {
        return this.bot
    }

    async onModuleInit() {
        this.bot = new Bot(ENV.BOT_TOKEN)

        this.bot.catch((err) => {
            this.logger.error('Bot error:', err.error)
        })

        this.setupHandlers()
        await this.bot.init()
        this.logger.log(`Bot initialized: @${this.bot.botInfo.username}`)
    }

    onModuleDestroy() {
        this.bot.stop()
        this.logger.log('Bot stopped')
    }

    async getToken(telegramId: number): Promise<string> {
        const key = `jwt_by_telegram:${telegramId}`

        const cacheToken: string | undefined = await this.cacheManager.get(key)
        if(cacheToken) {
            this.logger.debug(`Token cache hit for telegramId=${telegramId}`)
            return cacheToken
        }

        this.logger.debug(`Token cache miss, requesting new token for telegramId=${telegramId}`)
        const login = await this.gatewayClient.loginByTelegram(telegramId)
        await this.cacheManager.set(key, login.accessToken)

        return login.accessToken
    }

    setupHandlers() {
        this.bot.on('message:text', async (ctx) => {
            const telegramId = ctx.from.id
            const text = ctx.message.text
            this.logger.log(`Message from telegramId=${telegramId}: "${text.substring(0, 50)}"`)

            try {
                this.logger.log(`Message from telegramId=${telegramId}: "${text.substring(0, 50)}"`)
                const token = await this.getToken(telegramId)

                const aiResponse = await this.gatewayClient.sendMessage(text, token)
                this.logger.log(`AI response for telegramId=${telegramId}: intent=${aiResponse.intent}`)

                if (aiResponse.intent === 'parse_workout' && aiResponse.data) {
                    const key = `parsed_workout:${telegramId}`
                    await this.cacheManager.set(key, JSON.stringify(aiResponse.data))
                    this.logger.log(`Parsed workout cached for telegramId=${telegramId}`)
                    const keyboard = new InlineKeyboard().text('Сохранить тренировку', 'save_workout')
                    await ctx.reply(aiResponse.message, {reply_markup: keyboard})
                } else {
                    await ctx.reply(aiResponse.message)
                }

            } catch (error) {
                this.logger.error(`Error handling message from telegramId=${telegramId}`, error)
                await ctx.reply('Произошла ошибка. Попробуйте позже.')
            }
        })

        this.bot.callbackQuery('save_workout', async (ctx) => {
            const telegramId = ctx.from.id
            const key = `parsed_workout:${telegramId}`
            this.logger.log(`Save workout request from telegramId=${telegramId}`)
            try {
                const token = await this.getToken(telegramId)
                const lastWorkout: string| undefined = await this.cacheManager.get(key)
                if (!lastWorkout) {
                    this.logger.warn(`No cached workout for telegramId=${telegramId}`)
                    await ctx.answerCallbackQuery({ text: 'Тренировка не найдена или устарела. Отправьте заново.' })
                    return
                }
                const workoutInput = this.mapToCreateWorkoutInput(JSON.parse(lastWorkout))

                await this.gatewayClient.createWorkout(workoutInput, token)
                await this.cacheManager.del(key)
                this.logger.log(`Workout saved for telegramId=${telegramId}`)
                await ctx.answerCallbackQuery({ text: 'Тренировка сохранена!' })
                await ctx.editMessageText(ctx.callbackQuery.message?.text + '\n\n✅ Сохранено')

            } catch (error) {
                this.logger.error(`Error saving workout for telegramId=${telegramId}`, error)
                await ctx.answerCallbackQuery({ text: 'Ошибка при сохранении.' })
            }
        })
    }

    private mapToCreateWorkoutInput(data: any): CreateWorkoutInput {
        return {
            date: new Date(),
            exercises: data.exercises.map((ex: any) => ({
              exerciseId: ex.exerciseId,
              equipmentId: ex.equipmentId || undefined,
              sets: ex.sets.map((s: any) => ({
                weight: s.weight || undefined,
                sets: s.sets || 1,
                reps: s.reps || undefined,
                duration: s.duration || undefined,
              })),
            })),
        } 
    }

}