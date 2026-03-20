import { Inject, Injectable } from "@nestjs/common";
import { Tool } from "./tool.abstract";
import { CLIENTS, WORKOUT_PATTERNS } from "@app/contracts";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

interface ParsedExercise {
    exerciseId: string
    exerciseName: string
    equipmentId?: string
    equipmentName?: string
    sets: { sets: number; reps?: number; weight?: number; duration?: number }[]
}

interface ParsedWorkoutResult {
    exercises: ParsedExercise[]
}

@Injectable()
export class ParseWorkoutTool extends Tool {

    constructor(@Inject(CLIENTS.PARSING_SERVICE) private readonly client: ClientProxy) {
        super();
    }

    async execute(userId: string, text: string): Promise<{ message: string; data?: unknown }> {
        const result = await firstValueFrom(
            this.client.send<ParsedWorkoutResult>(WORKOUT_PATTERNS.PARSE, { userId, text })
        );

        if (!result.exercises.length) {
            return { message: 'Не удалось распознать упражнения. Попробуй описать подробнее.' }
        }

        const lines = result.exercises.map((ex, i) => {
            const sets = ex.sets.map(s => {
                if (s.duration) return `  ${s.sets}x ${s.duration}сек`
                const weight = s.weight ? ` — ${s.weight} кг` : ''
                return `  ${s.sets}x${s.reps ?? 1}${weight}`
            }).join('\n')
            const equipment = ex.equipmentName ? ` (${ex.equipmentName})` : ''
            return `${i + 1}. ${ex.exerciseName}${equipment}\n${sets}`
        })

        return {
            message: `Распознанная тренировка:\n\n${lines.join('\n\n')}`,
            data: result,
        }
    }
}