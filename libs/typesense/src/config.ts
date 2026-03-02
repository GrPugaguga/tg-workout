import { ENV } from '@app/core'
import { setDefaultConfiguration } from 'typesense-ts'

export function initTypesense() {
	setDefaultConfiguration({
		apiKey: ENV.TYPESENSE_API_KEY,
		nodes: [{ url: ENV.TYPESENSE_URL }],
		numRetries: 3,
		retryIntervalSeconds: 1
	})
}
