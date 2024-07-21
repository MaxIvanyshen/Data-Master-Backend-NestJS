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
    Put,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { MysqlService } from './mysql.service';

@Controller('mysql')
export class MysqlController {
    constructor(private service: MysqlService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('add-data')
    async addData(@Req() req: Request) {
        await this.service.saveDbData(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Put('data')
    async editData(@Req() req: Request) {
        await this.service.editDbData(req);
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
    async getTables(@Req() req: Request, @Query("database") db: string) {
        return await this.service.getTables(req, db);
    }
}
