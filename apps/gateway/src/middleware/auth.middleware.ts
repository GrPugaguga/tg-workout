import { ENV, X_TELEGRAM_ID, X_USER_ID } from '@app/core'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly jwtService: JwtService) {}

	use(req: Request, _res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization
		if (!authHeader?.startsWith('Bearer ')) {
			return next()
		}

		const token = authHeader.slice(7)

		try {
			const payload = this.jwtService.verify(token, {
				secret: ENV.JWT_SECRET
			})
			req.headers[X_USER_ID] = payload.sub
			req.headers[X_TELEGRAM_ID] = String(payload.telegramId)
		} catch {
			// Invalid token — пропускаем, protected routes упадут на AuthenticatedGuard
		}

		next()
	}
}
