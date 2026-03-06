import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { AgentResolver } from "./agent.resolver";


@Module({
    providers: [
        AgentService,
        AgentResolver
    ]
})
export class AgentModule {}