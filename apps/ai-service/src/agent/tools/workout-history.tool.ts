import { Inject, Injectable } from "@nestjs/common";
import { Tool } from "./tool.abstract";
import { CLIENTS, WORKOUT_PATTERNS } from "@app/contracts";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

interface WorkoutSummary {
    id: string
    date: string
    exercises: { exercise: { name: string }; sets: { sets: number; reps?: number; weight?: number; duration?: number }[] }[]
}

@Injectable()
export class WorkoutHistoryTool extends Tool {

    constructor(@Inject(CLIENTS.WORKOUT_SERVICE) private readonly client: ClientProxy) {
        super();
    }

    async execute(userId: string, _text: string): Promise<{ message: string; data?: unknown }> {
        const workouts = await firstValueFrom(
            this.client.send<WorkoutSummary[]>(WORKOUT_PATTERNS.GET_USER_WORKOUTS, { userId, take: 5 })
        );

        if (!workouts.length) {
            return { message: 'У тебя пока нет сохранённых тренировок.' }
        }

        const lines = workouts.map((w, i) => {
            const date = new Date(w.date).toLocaleDateString('ru-RU')
            const exercises = w.exercises.map(e => {
                const sets = e.sets.map(s => {
                    if (s.duration) return `${s.sets}x${s.duration}сек`
                    const weight = s.weight ? ` — ${s.weight}кг` : ''
                    return `${s.sets}x${s.reps ?? 1}${weight}`
                }).join(', ')
                return `  - ${e.exercise.name}: ${sets}`
            }).join('\n')
            return `${i + 1}. ${date}\n${exercises}`
        })

        return {
            message: `Последние тренировки:\n\n${lines.join('\n\n')}`,
            data: workouts,
        }
    }
}