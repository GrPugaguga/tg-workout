import { X_USER_ID } from '@app/core'
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class OnlySelfGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const userId = ctx.getContext().req.headers[X_USER_ID]
		const args = ctx.getArgs()

		if (args.id && args.id !== userId) {
			throw new ForbiddenException('You can only access your own data')
		}

		return true
	}
}
