import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DbDataService } from 'src/db-data/db-data.service';
import { TokenService } from 'src/token/token.service';
import { Db } from 'src/db-data/entity/db-data.entity';
import { DbData } from 'src/db-data/entity/db-data.entity';
import { MongoDAO } from './mongo.dao';
import { MongoRequest } from 'src/db-requests/mongoRequest';

@Injectable()
export class MongoService {
    constructor(
        private tokenService: TokenService,
        private dbDataService: DbDataService,
        private dao: MongoDAO,
    ) {}

    async saveDbData(req: Request) {
        const uuid = await this.tokenService.getUUID(
            await this.tokenService.extractTokenFromHeader(req)
        );
        const data = req.body;
        this.dbDataService.save(uuid, data, Db.MongoDB);
    }

    async select(req: Request) {
        const { db, mongoReq } = await this.getQuery(req);
        return await this.dao.select(db, mongoReq);
    }

    async insert(req: Request) {
        const { db, mongoReq } = await this.getQuery(req);
        this.dao.insert(db, mongoReq);
    }

    async update(req: Request) {
        const { db, mongoReq } = await this.getQuery(req);
        this.dao.update(db, mongoReq);
    }

    async delete(req: Request) {
        const { db, mongoReq } = await this.getQuery(req);
        this.dao.delete(db, mongoReq);
    }

    async createCollection(req: Request) {
        const { db, mongoReq } = await this.getQuery(req); 
        this.dao.createCollection(db, mongoReq);
    }

    private async getQuery(req: Request) {
        const token = await this.tokenService.extractTokenFromHeader(req);
        const uuid = await this.tokenService.getUUID(token);
        
        const mongoReq: MongoRequest = req.body;

        const db = await this.getDb(uuid, mongoReq.database);

        return { db, mongoReq };
    }

    private async getDb(uuid: string, dbName: string): Promise<DbData> {
        const mongoData = await this.dbDataService.findByUserAndDb(uuid, Db.MongoDB);

        const found = mongoData.find(db => {
            if(db.data["connection_data"]) {
                return db.data["connection_data"]["database"] === dbName;
            }
        });

        if(!found) {
            throw new NotFoundException("Can't find database with name '" + dbName + "'");
        }

        return found;
    }
}
