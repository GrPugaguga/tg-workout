import { X_CORRELATION_ID } from '@app/core'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const correlationId =
			(req.headers[X_CORRELATION_ID] as string) || randomUUID()
		req.headers[X_CORRELATION_ID] = correlationId
		res.setHeader(X_CORRELATION_ID, correlationId)
		next()
	}
}
