import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('app')
export class AppController {

    @UseGuards(AuthGuard)
    @Get()
    async getHello() {
        return "Hello world";
    }
}
