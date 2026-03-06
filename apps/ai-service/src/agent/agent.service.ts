import { Injectable } from "@nestjs/common";
import { AiResponseType } from "./dto/ai-response.type";
import { SendMessageInput } from "./dto/send-message.input";


@Injectable()
export class AgentService {
    async handleMessage(userId: string, input: SendMessageInput): Promise<AiResponseType> {
        return {
            message: `You said: ${input.text}`,
            intent: 'echo',
            data: null
        }
    }
}