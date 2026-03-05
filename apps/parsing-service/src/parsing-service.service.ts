import { exerciseCollection } from '@app/typesense'
import { Inject, Injectable, Logger } from '@nestjs/common'

import { ParsedWorkoutResult, ParseWorkoutDto } from './dto/parse-workout.dto'
import { AI_MODELS, AiModel } from 'libs/ai_models/src'

@Injectable()
export class ParsingServiceService {
	private readonly logger = new Logger(ParsingServiceService.name)

	constructor(
		@Inject(AI_MODELS.PARSER) private readonly ai: AiModel
	){}

	async parse(dto: ParseWorkoutDto): Promise<ParsedWorkoutResult> {
		this.logger.log(`Parsing workout for user ${dto.userId}`)

		// TODO: call LLM with dto.text → get exercise names + sets/reps
		// const llmResult = await this.llm.parse(dto.text)

		// TODO: fuzzy match exercise names to IDs via Typesense
		// const exercises = await this.matchExercises(llmResult.exercises)

		return { exercises: [] }
	}

	private async matchExercise(name: string) {
		const result = await exerciseCollection.search({
			q: name,
			query_by: ['name', 'aliases'],
			num_typos: 2,
			per_page: 1,
		})
		return result.hits?.[0]?.document ?? null
	}
}
