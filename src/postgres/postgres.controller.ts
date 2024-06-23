import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { PostgresService } from './postgres.service';

@Controller('postgres')
export class PostgresController {
    constructor(private service: PostgresService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('add-data')
    async addData(@Req() req: Request) {
         await this.service.saveDbData(req);
    }
}
