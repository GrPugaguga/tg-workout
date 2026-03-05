import { exerciseCollection, equipmentCollection } from '@app/typesense'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { AI_MODELS, AiModel, buildParseWorkoutPrompt } from '@app/ai_models'

import { ParsedExercise, ParsedWorkoutResult, ParseWorkoutDto } from './dto/parse-workout.dto'

interface LlmExercise {
	exerciseName: string
	equipmentName?: string
	sets: { sets: number; reps?: number; weight?: number; duration?: number }[]
}

@Injectable()
export class ParsingServiceService {
	private readonly logger = new Logger(ParsingServiceService.name)

	constructor(
		@Inject(AI_MODELS.PARSER) private readonly ai: AiModel,
	) {}

	async parse(dto: ParseWorkoutDto): Promise<ParsedWorkoutResult> {
		this.logger.log(`Parsing workout for user ${dto.userId}`)

		const systemPrompt = await this.buildPrompt()

		const raw = await this.ai.generateResponse(
			[
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: dto.text },
			],
			{ jsonMode: true, temperature: 0.1 },
		)

		let parsed: { exercises: LlmExercise[] }
		try {
			parsed = JSON.parse(raw)
		} catch {
			this.logger.error(`Failed to parse LLM response: ${raw}`)
			return { exercises: [] }
		}

		const exercises: ParsedExercise[] = await Promise.all(
			parsed.exercises.map(async (ex) => {
				const matched = await this.matchExercise(ex.exerciseName)
				const equipment = ex.equipmentName
					? await this.matchEquipment(ex.equipmentName)
					: null

				return {
					exerciseId: matched?.id ?? '',
					exerciseName: matched?.name ?? ex.exerciseName,
					equipmentId: equipment?.id,
					equipmentName: equipment?.name,
					sets: ex.sets,
				}
			}),
		)

		return { exercises }
	}

	private async buildPrompt(): Promise<string> {
		const exResult = await exerciseCollection.search({
			q: '*',
			query_by: ['name'],
			per_page: 250,
		})
		const exercises = (exResult.hits ?? []).map(h => ({
			name: h.document.name,
			aliases: h.document.aliases,
		}))

		const eqResult = await equipmentCollection.search({
			q: '*',
			query_by: ['name'],
			per_page: 250,
		})
		const equipment = (eqResult.hits ?? []).map(h => ({
			name: h.document.name,
			aliases: h.document.aliases,
		}))

		return buildParseWorkoutPrompt({ exercises, equipment })
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

	private async matchEquipment(name: string) {
		const result = await equipmentCollection.search({
			q: name,
			query_by: ['name', 'aliases'],
			num_typos: 2,
			per_page: 1,
		})
		return result.hits?.[0]?.document ?? null
	}
}
