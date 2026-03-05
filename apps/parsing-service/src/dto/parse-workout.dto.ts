export class ParseWorkoutDto {
	text!: string
	userId!: string
}

export class ParsedExercise {
	exerciseId!: string
	exerciseName!: string
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
