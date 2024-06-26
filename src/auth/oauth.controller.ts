import { Controller, Get, UseGuards, Req, Res, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from 'src/token/token.service';
import { UserDto } from 'src/user/dto/user.dto';
import { NoCacheInterceptor } from './oauth.interceptor';

@Controller('oauth')
export class OAuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
    ) {}

    @Get('google')
    @UseInterceptors(NoCacheInterceptor)
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    }

    @Get('google/callback')
    @UseInterceptors(NoCacheInterceptor)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        try {
            const dto = new UserDto();

            dto.email = req.user["email"];
            dto.firstname = req.user["firstname"];
            dto.lastname = req.user["lastname"];

            const { accessToken, refreshToken } = await this.authService.loginGoogle(dto);
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, private',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 14 * 24 * 60 * 60 * 1000 }); // 14 days
            res.status(HttpStatus.CREATED).json({ accessToken });
        } catch (error) {
            res.status(HttpStatus.CONFLICT).json({ message: error.message });
        }
    }
}
