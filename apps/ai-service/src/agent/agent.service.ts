import { Injectable } from "@nestjs/common";
import { AiResponseType } from "./dto/ai-response.type";
import { SendMessageInput } from "./dto/send-message.input";
import { FreeChatTool, OffTopTool, ParseWorkoutTool, SearchWorkoutTool, Tool, WorkoutHistoryTool } from "./tools";
import { ClassifierService } from "./classifier/classifier.service";


@Injectable()
export class AgentService {
    private tools: Record<string, Tool>

    constructor(
        private readonly classifier: ClassifierService,
        private readonly freeChatTool: FreeChatTool,
        private readonly parseWorkoutTool: ParseWorkoutTool,
        private readonly searchExerciseTool: SearchWorkoutTool,
        private readonly workoutHistoryTool: WorkoutHistoryTool,
        private readonly offTopTool: OffTopTool
    ) {
        this.tools = {
            'free_chat': freeChatTool,
            'parse_workout': parseWorkoutTool,
            'search_exercise': searchExerciseTool,
            'workout_history': workoutHistoryTool,
            'off_topic': offTopTool
        }
    }

    async handleMessage(userId: string, input: SendMessageInput): Promise<AiResponseType> {
        const intent = await this.classifier.classify(input.text);
        const tool = this.tools[intent];
        const result = await tool.execute(userId, input.text);
        return {
            message: result.message,
            intent,
            data: result.data ?? null
        }
    }
}