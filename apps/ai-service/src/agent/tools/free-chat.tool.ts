import { Inject, Injectable } from "@nestjs/common";
import { Tool } from "./tool.abstract";
import { AI_MODELS, AiModel } from "@app/ai_models";
import { FREE_CHAT_PROMPT } from "../prompts/free-chat.prompt";

@Injectable()
export class FreeChatTool extends Tool {

    constructor(@Inject(AI_MODELS.CHAT) private readonly ai: AiModel) {
        super();
    }

    async execute(userId: string, text: string): Promise<{ message: string; data?: unknown }> {
       const response = await this.ai.generateResponse(
                  [
                      { role: 'system', content: FREE_CHAT_PROMPT },
                      { role: 'user', content: text },
                  ],
                  { temperature: 0.0 }
              );
      return { message: response };
    }
}