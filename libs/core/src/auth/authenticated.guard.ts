import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { X_USER_ID } from '../constants/headers'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = GqlExecutionContext.create(context).getContext().req
		const userId = request.headers[X_USER_ID]

		if (!userId) {
			throw new UnauthorizedException('Missing authentication')
		}

		return true
	}
}
