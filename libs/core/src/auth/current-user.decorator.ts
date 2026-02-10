import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { X_TELEGRAM_ID, X_USER_ID } from '../constants/headers'

import { FederationUser } from './federation-user.interface'

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): FederationUser => {
		const request = GqlExecutionContext.create(ctx).getContext().req
		return {
			id: request.headers[X_USER_ID],
			telegramId: request.headers[X_TELEGRAM_ID]
		}
	}
)
