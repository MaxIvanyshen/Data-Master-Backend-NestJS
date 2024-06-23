import { AuthService } from './auth.service';
import { Post, Body, Res, Req, Controller, HttpStatus, UnauthorizedException, HttpCode } from '@nestjs/common';
import { Response, Request } from 'express';
import { TokenService } from 'src/token/token.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
    ) {}

    @Post('register')
    async register(@Body() createUserDto: UserDto, @Res() res: Response) {
        try {
            const user = await this.authService.register(createUserDto);
            const { accessToken, refreshToken } = await this.authService.login({ email: user.email, password: createUserDto.password });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 14 * 24 * 60 * 60 * 1000 }); // 14 days
            res.status(HttpStatus.CREATED).json({ accessToken });
        } catch (error) {
            res.status(HttpStatus.CONFLICT).json({ message: error.message });
        }
    }

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

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Req() req: Request) {
        return this.authService.logout(await this.tokenService.extractTokenFromHeader(req))
    }
}
