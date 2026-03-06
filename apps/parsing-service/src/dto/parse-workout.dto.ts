import { AiMessage } from "@app/ai_models"

export class ParseWorkoutDto {
	text!: string
	history?: AiMessage[]
	userId!: string
}

export class ParsedExercise {
	exerciseId!: string
	exerciseName!: string
	equipmentId?: string
	equipmentName?: string
	sets!: ParsedSet[]
}

export class ParsedSet {
	sets!: number
	reps?: number
	weight?: number
	duration?: number
}

export class ParsedWorkoutResult {
	exercises!: ParsedExercise[]
}
