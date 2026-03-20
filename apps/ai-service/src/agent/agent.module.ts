import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { AgentResolver } from "./agent.resolver";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CLIENTS, QUEUES } from "@app/contracts";
import { ENV } from "@app/core";
import { AI_MODEL_NAMES, AI_MODELS, OpenAIModel } from "@app/ai_models";
import { ClassifierService } from "./classifier/classifier.service";
import { ParseWorkoutTool, SearchWorkoutTool, WorkoutHistoryTool, FreeChatTool, OffTopTool } from "./tools";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: CLIENTS.PARSING_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: [ENV.RABBITMQ_URL],
                    queue: QUEUES.PARSING,
                    queueOptions: { durable: true },
                }
            },
            {
                name: CLIENTS.WORKOUT_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: [ENV.RABBITMQ_URL],
                    queue: QUEUES.WORKOUT,
                    queueOptions: { durable: true },
                }
            },
        ])
    ],
    providers: [
        { provide: AI_MODELS.CHAT, useFactory: () => new OpenAIModel(AI_MODEL_NAMES.GPT_4O_MINI) },
        AgentService,
        AgentResolver,
        ClassifierService,
        ParseWorkoutTool,
        SearchWorkoutTool,
        WorkoutHistoryTool,
        FreeChatTool,
        OffTopTool,
    ]
})
export class AgentModule {}