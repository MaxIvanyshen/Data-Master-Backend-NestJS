import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DbDataService } from 'src/db-data/db-data.service';
import { Db } from 'src/db-data/entity/db-data.entity';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class PostgresService {
    constructor(
        private tokenService: TokenService,
        private dbDataService: DbDataService,
    ) {}

    async saveDbData(req: Request) {
        const token = await this.tokenService.extractTokenFromHeader(req);
        const uuid = await this.tokenService.getUUID(token);
        const data = req.body;
        await this.dbDataService.save(uuid, data, Db.PostgreSQL);
    }
}
