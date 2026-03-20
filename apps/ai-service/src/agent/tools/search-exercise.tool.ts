import { Inject, Injectable } from "@nestjs/common";
import { Tool } from "./tool.abstract";
import { CLIENTS, EXERCISE_PATTERNS } from "@app/contracts";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { SearchExerciseResult } from "@app/contracts/dto";

@Injectable()
export class SearchWorkoutTool extends Tool {

    constructor(@Inject(CLIENTS.PARSING_SERVICE) private readonly client: ClientProxy) {
        super();
    }

    async execute(userId: string, text: string): Promise<{ message: string; data?: unknown }> {
        const results = await firstValueFrom(
            this.client.send<SearchExerciseResult[]>(EXERCISE_PATTERNS.SEARCH, { query: text })
        );

        if (!results.length) {
            return { message: 'Упражнения не найдены. Попробуй другой запрос.' }
        }

        const lines = results.map((ex, i) => {
            const aliases = ex.aliases?.length ? ` (${ex.aliases.join(', ')})` : ''
            return `${i + 1}. ${ex.name}${aliases} — ${ex.muscleGroups.join(', ')}`
        })

        return {
            message: `Найденные упражнения:\n\n${lines.join('\n')}`,
            data: results,
        }
    }
}