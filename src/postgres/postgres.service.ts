import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DbDataService } from 'src/db-data/db-data.service';
import { Db, DbData } from 'src/db-data/entity/db-data.entity';
import { TokenService } from 'src/token/token.service';
import { PostgresDAO } from './postgres.dao';
import { DbRequest } from 'src/db-requests/dbRequest';

@Injectable()
export class PostgresService {
    constructor(
        private tokenService: TokenService,
        private dbDataService: DbDataService,
        private dao: PostgresDAO,
    ) {}

    async saveDbData(req: Request) {
        const uuid = await this.tokenService.getUUID(
            await this.tokenService.extractTokenFromHeader(req)
        );
        const data = req.body;
        await this.dbDataService.save(uuid, data, Db.PostgreSQL);
    }

    async editDbData(req: Request) {
        const uuid = await this.tokenService.getUUID(
            await this.tokenService.extractTokenFromHeader(req)
        );
        const data = req.body;
        await this.dbDataService.edit(uuid, data, Db.PostgreSQL);
    }

    async select(req: Request) {
        const { db, sqlReq } = await this.getQuery(req);
        return await this.dao.select(db, sqlReq);
    }

    async insert(req: Request) {
        const { db, sqlReq } = await this.getQuery(req);
        return await this.dao.insert(db, sqlReq);
    }

    async update(req: Request) {
        const { db, sqlReq } = await this.getQuery(req);
        return await this.dao.update(db, sqlReq);
    }

    async delete(req: Request) {
        const { db, sqlReq } = await this.getQuery(req);
        return await this.dao.delete(db, sqlReq);
    }

    async custom(req: Request) {
        const { db, sqlReq } = await this.getQuery(req);
        return await this.dao.custom(db, sqlReq);
    }

    async getTables(req: Request, db: string) {
        const database = await this.getDb(await this.tokenService.getUUID(await this.tokenService.extractTokenFromHeader(req)), db);
        return await this.dao.getTables(database, undefined);
    }

    private async getQuery(req: Request) {
        const token = await this.tokenService.extractTokenFromHeader(req);
        const sqlReq: DbRequest = req.body;
        const db = await this.getDb(await this.tokenService.getUUID(token), sqlReq.database);

        return { db, sqlReq };
    }

    private async getDb(uuid: string, dbName: string): Promise<DbData> {
        const postgresData = await this.dbDataService.findByUserAndDb(uuid, Db.PostgreSQL);

        const found = postgresData.find(db => {
            if(db.data["connection_data"]) {
                return db.data["connection_data"]["database"] === dbName;
            }
            else {
                return db.data["connection_string"].split("/")[3] === dbName;
            }
        });
        if(!found) {
            throw new NotFoundException("Can't find database with name '" + dbName + "'");
        }

        return found;
    }

    async getStats(database: string, req: Request) {
        const db = await this.getDb(await this.tokenService.getUUID(await this.tokenService.extractTokenFromHeader(req)), database);

        const memoryUsage = await this.convertMemoryUsage(await this.dao.getMemoryUsageData(db));
        const activeConnections = Number(await this.dao.getActiveConnections(db));
        const operations = await this.convertOperationsCounts(await this.dao.getOperationsCount(db));

        return {
            memoryUsage,
            activeConnections,
            operations
        }
    }

    private async convertOperationsCounts(countRow: object) {
        let result = {};
        let total = 0;
        Object.entries(countRow).map(([key, value]) => {
            result[key.substring(0, key.indexOf('_'))] = Number(value);
            total += Number(value);
        });
        result["total"] = total;
        return result;
    }

    private async convertMemoryUsage(memoryUsage: object) {
        const newTables = {};

        memoryUsage["tables"].forEach((table: object) => {
            const bytes = Number(table["size"].split(/\s+/)[0]) * 1024;
            newTables[table["table_name"]] = bytes;
        })

        return {
            databaseTotal: Number(memoryUsage["databaseTotal"].split(/\s+/)[0]) * 1024,
            tables: newTables,
        };
    }
}
    
