import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { WORKOUT_PATTERNS } from '@app/contracts'

import { ParsingServiceService } from './parsing-service.service'
import { ParseWorkoutDto } from './dto/parse-workout.dto'

@Controller()
export class ParsingServiceController {
	constructor(private readonly parsingServiceService: ParsingServiceService) {}

	@MessagePattern(WORKOUT_PATTERNS.PARSE)
	parse(@Payload() dto: ParseWorkoutDto) {
		return this.parsingServiceService.parse(dto)
	}
}
