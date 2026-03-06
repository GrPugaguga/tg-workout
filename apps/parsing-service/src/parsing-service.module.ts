import { Module } from '@nestjs/common'

import { ParsingServiceController } from './parsing-service.controller'
import { ParsingServiceService } from './parsing-service.service'
import { AI_MODEL_NAMES, AI_MODELS, OpenAIModel } from '@app/ai_models'
import { createLoggerModule } from '@app/utils'

@Module({
	imports: [
		createLoggerModule('parsing-service')
	],
	controllers: [ParsingServiceController],
	providers: [
		{ provide: AI_MODELS.PARSER, useFactory: () => new OpenAIModel(AI_MODEL_NAMES.GPT_4O_MINI) },
		ParsingServiceService
	],
})
export class ParsingServiceModule {}
