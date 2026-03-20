import { Module } from "@nestjs/common";
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { ENV } from "@app/core";
import { GatewayClientModule } from "../gateway-client/gateway-client.module";
import { BotService } from "./bot.service";

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => {
                return {
                    stores: [
                        new KeyvRedis(ENV.REDIS_URL, {
                            
                        }),
                        new Keyv({
                            store: new CacheableMemory()
                        })
                    ]
                }
            }
        }), 
        GatewayClientModule
    ],
    providers: [ BotService ],
    exports: [ BotService]
})
export class BotModule {}


