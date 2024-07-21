import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DbDataService } from 'src/db-data/db-data.service';
import { Db, DbData } from 'src/db-data/entity/db-data.entity';
import { TokenService } from 'src/token/token.service';
import { MysqlDAO } from './mysql.dao';
import { DbRequest } from 'src/db-requests/dbRequest';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class MysqlService {
    constructor(
        private tokenService: TokenService,
        private dbDataService: DbDataService,
        private dao: MysqlDAO,
    ) {}

    async saveDbData(req: Request) {
        const uuid = await this.tokenService.getUUID(
            await this.tokenService.extractTokenFromHeader(req)
        );
        const data = req.body;
        if(data["connection_string"] && !data["connection_data"]) {
            const vals = data["connection_string"].split("/");

            const [ userData, hostData ] = vals[2].split("@");
            const [ user, password ] = userData.split(":");
            const [ host, port ] = hostData.split(":");
            const dbName = vals[3];

            data["connection_data"] = {
                "host": host,
                "port": port,
                "user": user,
                "password": password,
                "database": dbName,
            }
        }
        await this.dbDataService.save(uuid, data, Db.MySQL);
    }

    async editDbData(req: Request) {
        const uuid = await this.tokenService.getUUID(
            await this.tokenService.extractTokenFromHeader(req)
        );
        const data = req.body;
        if(data["connection_string"] && !data["connection_data"]) {
            const vals = data["connection_string"].split("/");

            const [ userData, hostData ] = vals[2].split("@");
            const [ user, password ] = userData.split(":");
            const [ host, port ] = hostData.split(":");
            const dbName = vals[3];

            data["connection_data"] = {
                "host": host,
                "port": port,
                "user": user,
                "password": password,
                "database": dbName,
            }
        }
        await this.dbDataService.edit(uuid, data, Db.MySQL);
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
        const tables = await this.dao.getTables(database, db);
        let tableNames = [];

        if(Array.isArray(tables)) {
            for(let i = 0; i < tables.length; i++) {
                tableNames.push((tables[i] as RowDataPacket).table_name);
            }
        }
        
        return tableNames;
    }

    private async getQuery(req: Request) {
        const token = await this.tokenService.extractTokenFromHeader(req);
        const sqlReq: DbRequest = req.body;
        const db = await this.getDb(await this.tokenService.getUUID(token), sqlReq.database);

        return { db, sqlReq };
    }

    private async getDb(uuid: string, dbName: string): Promise<DbData> {
        const mysqlData = await this.dbDataService.findByUserAndDb(uuid, Db.MySQL);

        const found = mysqlData.find(db => {
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
}
