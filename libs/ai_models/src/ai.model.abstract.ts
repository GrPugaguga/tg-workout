
export interface AiMessage {
	role: 'system' | 'user' | 'assistant'
	content: string
}

export interface AiModelOptions {
	temperature?: number
	jsonMode?: boolean
}

export abstract class AiModel {
	abstract generateResponse(messages: AiMessage[], options?: AiModelOptions): Promise<string>
}