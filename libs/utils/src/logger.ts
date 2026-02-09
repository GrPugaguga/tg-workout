import { ENV } from '@app/core'
import pino from 'pino'

const logger = pino({
	level: ENV.LOG_LEVEL,
	transport:
		ENV.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined
})

export function createLogger(service: string) {
	return logger.child({ service })
}
