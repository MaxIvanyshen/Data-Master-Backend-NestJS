import { 
    Controller,
    HttpCode,
    HttpStatus, 
    Get,
    Post,
    Patch,
    Delete,
    Req,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { MongoService } from './mongo.service';

@Controller('mongo')
export class MongoController {
    constructor(private service: MongoService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('add-data')
    async addData(@Req() req: Request) {
        await this.service.saveDbData(req);
    }

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
        await this.service.insert(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch()
    async update(@Req() req: Request) {
        await this.service.update(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete()
    async delete(@Req() req: Request) {
        await this.service.delete(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('collection')
    async getCollections(@Req() req: Request) {
        return await this.service.getCollections(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('collection')
    async createCollection(@Req() req: Request) {
        await this.service.createCollection(req);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete('collection')
    async dropCollection(@Req() req: Request) {
        await this.service.dropCollection(req);
    }
}
