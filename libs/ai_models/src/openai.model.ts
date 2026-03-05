import { ENV } from '@app/core'
import { Injectable } from '@nestjs/common'
import { OpenAI } from 'openai'
import { AiModel, AiModelOptions, AiMessage } from './ai.model.abstract'
import { AI_MODEL_NAMES } from './ai-models.tokens'

@Injectable()
export class OpenAIModel extends AiModel {
	private readonly client: OpenAI
	private readonly modelName: string

	constructor(modelName: string = AI_MODEL_NAMES.GPT_4O_MINI) {
		super()
		this.modelName = modelName
		this.client = new OpenAI({ apiKey: ENV.OPENAI_API_KEY })
	}

	async generateResponse(messages: AiMessage[], options?: AiModelOptions): Promise<string> {
		const response = await this.client.chat.completions.create({
			model: this.modelName,
			messages,
			temperature: options?.temperature,
			response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
		})
		return response.choices[0].message.content ?? ''
	}
}