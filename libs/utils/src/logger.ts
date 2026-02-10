import { ENV, X_CORRELATION_ID, X_USER_ID } from '@app/core'
import { LoggerModule } from 'nestjs-pino'

export function createLoggerModule(service: string) {
	return LoggerModule.forRoot({
		pinoHttp: {
			level: ENV.LOG_LEVEL,
			transport:
				ENV.NODE_ENV === 'development'
					? { target: 'pino-pretty' }
					: undefined,
			base: { service },
			customProps: (req: any) => ({
				correlationId: req.headers?.[X_CORRELATION_ID],
				userId: req.headers?.[X_USER_ID]
			})
		}
	})
}
