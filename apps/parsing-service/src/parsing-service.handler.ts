import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { EXERCISE_PATTERNS, WORKOUT_PATTERNS } from '@app/contracts'

import { ParsingServiceService } from './parsing-service.service'
import { ParseWorkoutDto } from './dto/parse-workout.dto'
import { SearchExerciseDto } from '@app/contracts/dto'

@Controller()
export class ParsingServiceHandler {
	constructor(private readonly parsingServiceService: ParsingServiceService) {}

	@MessagePattern(WORKOUT_PATTERNS.PARSE)
	parse(@Payload() dto: ParseWorkoutDto) {
		return this.parsingServiceService.parse(dto)
	}

	@MessagePattern(EXERCISE_PATTERNS.SEARCH)
	searchExercise(@Payload() dto: SearchExerciseDto) {
		return this.parsingServiceService.searchExercise(dto.query)
	}
	}
