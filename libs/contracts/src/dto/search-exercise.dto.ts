export class SearchExerciseDto {
  query!: string
}

export class SearchExerciseResult {
  id!: string
  name!: string
  aliases?: string[]
  muscleGroups!: string[]
}


