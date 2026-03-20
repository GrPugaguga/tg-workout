import { Module } from '@nestjs/common'

import { ParsingServiceHandler } from './parsing-service.handler'
import { ParsingServiceService } from './parsing-service.service'
import { AI_MODEL_NAMES, AI_MODELS, OpenAIModel } from '@app/ai_models'
import { createLoggerModule } from '@app/utils'

@Module({
	imports: [
		createLoggerModule('parsing-service')
	],
	controllers: [ParsingServiceHandler],
	providers: [
		{ provide: AI_MODELS.PARSER, useFactory: () => new OpenAIModel(AI_MODEL_NAMES.GPT_4O_MINI) },
		ParsingServiceService
	],
})
export class ParsingServiceModule {}
