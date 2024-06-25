import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt";
import { jwtConstants } from './constants';
import { UserDto } from 'src/user/dto/user.dto';
import { BlacklistService } from 'src/blacklist/blacklist.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly blacklistService: BlacklistService,
    ) {}

    async register(dto: UserDto): Promise<UserDto> {
        return await this.usersService.create(dto);
    }

    async login(dto: LoginUserDto) {
       const user = await this.usersService.findByEmail(dto.email);
       if (!user || !await bcrypt.compare(dto.password, user.password)) {
            throw new UnauthorizedException("Invalid Credentials");
       }

       if(user.accessToken) {
           this.blacklistService.addTokenToBlacklist(user.accessToken);
       }
       if(user.refreshToken) {
           this.blacklistService.addTokenToBlacklist(user.refreshToken);
       }

       const payload = { sub: user.id };
       const accessToken = this.jwtService.sign(payload, { secret: jwtConstants.secret,  expiresIn: '15m' });
       const refreshToken = this.jwtService.sign(payload, { secret: jwtConstants.secret,  expiresIn: '14d' });

       user.accessToken = accessToken;
       user.refreshToken = refreshToken;

       await user.save();

       return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: jwtConstants.secret });
            const uuid = payload.sub;

            const user = await this.usersService.findByUUID(uuid);
            if(!user || user.refreshToken !== refreshToken ||
             await this.blacklistService.isTokenBlacklisted(refreshToken)) {
                throw new UnauthorizedException('Invalid refresh token')
            }

            this.blacklistService.addTokenToBlacklist(user.accessToken);
            this.blacklistService.addTokenToBlacklist(refreshToken);

            const newPayload = { sub: payload.sub };
            const newAccessToken = this.jwtService.sign(newPayload, { secret: jwtConstants.secret,  expiresIn: process.env.ACCESS_TOKEN_TTL });
            const newRefreshToken = this.jwtService.sign(newPayload, { secret: jwtConstants.secret,  expiresIn: process.env.REFRESH_TOKEN_TTL });

            user.accessToken = newAccessToken;
            user.refreshToken = newRefreshToken;

            await user.save();

            return { newAccessToken: newAccessToken, newRefreshToken: newRefreshToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }

    async logout(token: string) {
        await this.blacklistService.addTokenToBlacklist(token);
    }
}
