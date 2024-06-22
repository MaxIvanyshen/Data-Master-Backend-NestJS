import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt";
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async login(dto: LoginUserDto) {
       const user = await this.usersService.findByEmail(dto.email);
       if (!user || !await bcrypt.compare(dto.password, user.password)) {
            throw new UnauthorizedException("Invalid Credentials");
       }

       const payload = { sub: user.id };
       const accessToken = this.jwtService.sign(payload, { secret: jwtConstants.secret,  expiresIn: '15m' });
       const refreshToken = this.jwtService.sign(payload, { secret: jwtConstants.secret,  expiresIn: '14d' });

       return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: jwtConstants.secret });
            const newPayload = { sub: payload.sub };
            const newAccessToken = this.jwtService.sign(newPayload, { secret: jwtConstants.secret,  expiresIn: '15m' });
            const newRefreshToken = this.jwtService.sign(newPayload, { secret: jwtConstants.secret,  expiresIn: '14d' });

            return { newAccessToken: newAccessToken, newRefreshToken: newRefreshToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}
