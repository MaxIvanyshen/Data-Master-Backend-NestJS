import { Controller, Get } from '@nestjs/common';
import { DbDataService } from './db-data.service';

@Controller('db-data')
export class DbDataController {
    constructor( private dbDataService: DbDataService ) {}

    @Get()
    async getDbInfo() {
        return await this.dbDataService.getDbInfo();
    }
}
