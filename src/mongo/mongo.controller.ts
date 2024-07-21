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
import { MongoService } from './mongo.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('mongo')
export class MongoController {
    constructor(private service: MongoService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('data')
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
        await this.service.insert(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch("update")
    async update(@Req() req: Request) {
        await this.service.update(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("delete")
    async delete(@Req() req: Request) {
        await this.service.delete(req);
    }

    @UseInterceptors(CacheInterceptor)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('tables')
    async getCollections(@Req() req: Request, @Query('database') db: string) {
        return await this.service.getCollections(req, db);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('tables')
    async createCollection(@Req() req: Request) {
        await this.service.createCollection(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete('tables')
    async dropCollection(@Req() req: Request) {
        await this.service.dropCollection(req);
    }
}
