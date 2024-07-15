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
    Query,
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
        await this.service.saveDbData(req);
    }

    @UseInterceptors(CacheInterceptor)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("select")
    async select(@Req() req: Request) {
        return await this.service.select(req);
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("insert")
    async insert(@Req() req: Request) {
        return await this.service.insert(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch("update")
    async update(@Req() req: Request) {
        return await this.service.update(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("delete")
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
    @Get("tables")
    async getTables(@Req() req: Request, @Query('database') db:string) {
        return await this.service.getTables(req, db);
    }

}
