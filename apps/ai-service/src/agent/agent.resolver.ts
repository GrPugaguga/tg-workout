import { AuthenticatedGuard, CurrentUser, FederationUser } from '@app/core'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AgentService } from './agent.service'
import { AiResponseType, SendMessageInput } from '@app/contracts'

@Resolver()
export class AgentResolver {
	constructor(private readonly agentService: AgentService) {}

	@UseGuards(AuthenticatedGuard)
	@Mutation(() => AiResponseType)
	sendMessage(
		@CurrentUser() user: FederationUser,
		@Args('input') input: SendMessageInput,
	): Promise<AiResponseType> {
		return this.agentService.handleMessage(user.id, input)
	}
}