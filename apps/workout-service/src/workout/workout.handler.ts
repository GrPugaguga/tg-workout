import { Controller } from "@nestjs/common";
import { WorkoutQueryService } from "./workout-query.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { WORKOUT_PATTERNS } from "@app/contracts";
import { GetUserWorkoutsDto } from "@app/contracts/dto";
import { SortEnum } from "./dto/pagination.input";

@Controller()
export class WorkoutHandler {
    constructor(private readonly queryService: WorkoutQueryService) {}

    @MessagePattern(WORKOUT_PATTERNS.GET_USER_WORKOUTS)
    getUserWorkouts(@Payload() dto: GetUserWorkoutsDto) {
        return this.queryService.getUserWorkouts(dto.userId, {skip: 0, take: dto.take ?? 10, sort: SortEnum.desc })
    }
}