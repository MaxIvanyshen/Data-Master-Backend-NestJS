import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ){}

    @Get()
    @UseGuards(AuthGuard)
    async getUserInfo(@Req() req: Request) {
        return this.userService.getUserInfo(req)   
    }
}
