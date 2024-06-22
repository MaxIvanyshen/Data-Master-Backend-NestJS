import { AuthService } from './auth.service';
import { Post, Body, Res, Req, Controller, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(loginDto); 
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 14 * 24 * 60 * 60 * 1000 });
            res.status(HttpStatus.OK).json({ accessToken });
        } catch (e) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        if (!req.cookies) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Refresh token missing' });
        }
        const refreshToken = req.cookies['refreshToken'];
        console.log(refreshToken);

        try {
            const { newAccessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 14 * 24 * 60 * 60 * 1000 }); // 14 days
            res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
        }
    }
}
