import { Controller, Get } from '@nestjs/common'
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator
} from '@nestjs/terminus'

@Controller('health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly http: HttpHealthIndicator
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() =>
				this.http.pingCheck(
					'user-service',
					`http://localhost:${process.env.USER_SERVICE_PORT || 3001}/health`
				),
			() =>
				this.http.pingCheck(
					'workout-service',
					`http://localhost:${process.env.WORKOUT_SERVICE_PORT || 3002}/health`
				),
			() =>
				this.http.pingCheck(
					'bot-service',
					`http://localhost:${process.env.BOT_SERVICE_PORT || 3004}/health`
				)
		])
	}
}
