import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { ENV } from '@core/env.config';
import { createHmac } from 'crypto';
import { UsersService } from '../users/users.service';
import { TelegramUserDto } from './dto/telegramUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async generateToken(user: User): Promise<JwtResponseDto>{
        const payload: JwtPayload = {
            sub: user.id,
            telegramId: user.telegramId.get(),
            username: user.username,
        }
        return {
            accessToken: this.jwtService.sign(payload),
            expiredAt: Date.now() + ENV.JWT_EXPIRES_IN*1000
        }
    }

    async login(initData: string): Promise<JwtResponseDto> {
        const telegramUser = await this.validateTelegramInitData(initData)

        const user = await this.usersService.findOrCreate({
            telegramId: telegramUser.id,
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name
        })

        return this.generateToken(user)
    }

    async validateTelegramInitData(initData:string): Promise<TelegramUserDto>{
        const params = new URLSearchParams(initData)
        const hash = params.get('hash')
        params.delete('hash')

        const dataCheckString = Array.from(params.entries())
            .sort(([a],[b]) => a.localeCompare(b))
            .map(([key,value]) => `${key}=${value}`)
            .join('\n')

        const secretKey = createHmac('sha256', 'WebAppData')
            .update(ENV.BOT_TOKEN)
            .digest()

        const calculatedHash = createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex')

        if(calculatedHash !== hash){
            throw new UnauthorizedException('Invalid Telegram signature')
        }

        const userJson = params.get('user')

        if(!userJson) throw new UnauthorizedException('User data not found')

        return JSON.parse(userJson)
    }
}
