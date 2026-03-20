import { AI_MODELS, AiModel } from "@app/ai_models";
import { Inject, Injectable } from "@nestjs/common";
import { CLASSIFIER_PROMPT } from "../prompts/classifier.prompt";

@Injectable()
export class ClassifierService {
    constructor(@Inject(AI_MODELS.CHAT) private readonly ai: AiModel) {}
    
    async classify(text: string): Promise<string> {
        const response = await this.ai.generateResponse(
            [
                { role: 'system', content: CLASSIFIER_PROMPT },
                { role: 'user', content: text },
            ],
            { temperature: 0.0 }
        );
        const intent = response.trim().toLowerCase();
        const valid = ['parse_workout', 'search_exercise', 'workout_history', 'free_chat', 'off_topic'];

        return valid.includes(intent) ? intent : 'off_topic'
    }
}