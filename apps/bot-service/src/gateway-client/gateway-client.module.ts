import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { GatewayClientService } from "./gateway-client.service";


@Module({
    imports: [HttpModule],
    providers: [GatewayClientService],
    exports: [GatewayClientService]
})
export class GatewayClientModule {}