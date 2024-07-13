import { 
    Controller,
    HttpCode,
    HttpStatus, 
    Get,
    Post,
    Patch,
    Delete,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { PostgresService } from './postgres.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('postgres')
export class PostgresController {
    constructor(private service: PostgresService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('add-data')
    async addData(@Req() req: Request) {
        console.log(req.body);
        await this.service.saveDbData(req);
    }

    @UseInterceptors(CacheInterceptor)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    async select(@Req() req: Request) {
        return await this.service.select(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    async insert(@Req() req: Request) {
        return await this.service.insert(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch()
    async update(@Req() req: Request) {
        return await this.service.update(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete()
    async delete(@Req() req: Request) {
        return await this.service.delete(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("custom")
    async custom(@Req() req: Request) {
        return await this.service.custom(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("tables")
    async getTables(@Req() req: Request) {
        return await this.service.getTables(req);
    }

}
