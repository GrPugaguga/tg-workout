import { JwtResponseDto, LoginByTelegramDto, SendMessageInput, AiResponseType, CreateWorkoutInput } from "@app/contracts";
import { ENV } from "@app/core";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";


@Injectable()
export class GatewayClientService {
    private readonly logger = new Logger(GatewayClientService.name)

    constructor(
        private readonly httpService: HttpService
    ){}

    async request<T>(query: string, variables?: Record<string, any>, token?: string): Promise<T> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json'}
        if(token) headers['Authorization'] = `Bearer ${token}`
        
        const response = await firstValueFrom(
            this.httpService.post(ENV.GATEWAY_URL,{ query, variables }, {headers} )
        )

        if (response.data.errors?.length) {
            this.logger.error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`)
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data as T
    }

    async loginByTelegram(telegramId: number): Promise<JwtResponseDto> {
        this.logger.debug(`loginByTelegram telegramId=${telegramId}`)
        const query = `
        mutation LoginByTelegram($dto: LoginByTelegramDto!) {
            loginByTelegram(loginByTelegramDto: $dto) {
                accessToken,
                expiredAt
            }
        }`
        const variables: {dto: LoginByTelegramDto} = {
            dto: {
                telegramId, 
                botSecret: ENV.BOT_SECRET
            }
        }

        const result = await this.request<{ loginByTelegram: JwtResponseDto }>(query,variables)
        return result.loginByTelegram
    }

    async sendMessage( text: string, token: string): Promise<AiResponseType> {
        this.logger.debug('sendMessage')
        const query = `
        mutation SendMessage($input: SendMessageInput!) {
            sendMessage(input: $input) {
                message
                intent
                data
            }
        }`

        const variables: {input: SendMessageInput } = {
            input: {
                text: text
            }
        }

        const result = await this.request<{sendMessage: AiResponseType}>(query, variables, token)
        return result.sendMessage
    }

    async createWorkout(input: CreateWorkoutInput, token: string): Promise<{ id: string }>{
        this.logger.debug('createWorkout')
        const query = `
        mutation CreateWorkout($input: CreateWorkoutInput!) {
            createWorkout(input: $input) {
              id
            }
        }`

        const variables: {input: CreateWorkoutInput } = {
            input
        } 

        const result = await this.request<{createWorkout: { id: string }}>(query, variables, token)
        return result.createWorkout    
    }
}