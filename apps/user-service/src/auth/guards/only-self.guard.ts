import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";


@Injectable()
export class OnlySelfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const user = ctx.getContext().req.user
        const args = ctx.getArgs()

        if(args.id && args.id !== user.id) {
             throw new ForbiddenException('You can only access your own data')
        }
        
        return true
    }
}