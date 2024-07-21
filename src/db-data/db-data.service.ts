import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { Db, DbData } from './entity/db-data.entity';
import * as dbInfo from './db.json';

@Injectable()
export class DbDataService {
    constructor(
        @Inject("DB_DATA_REPOSITORY")
        private readonly dbDataRepo: typeof DbData,

    ){}

    async save(uuid: string, data: object, db: Db) {
        const dbData = new DbData();

        dbData.userId = uuid;
        dbData.data = data;
        dbData.db = db;

        const dbName = await this.parseDbName(dbData.data);
        const dbs = await this.findByUserAndDb(uuid, db);

        let found = undefined;
        for(let i = 0; i < dbs.length; i++) {
            if(dbs[i].dataValues["data"]["connection_data"]["database"] === dbName) {
                found = dbs[i].dataValues;
            }
        }

        if(found) {
            throw new ConflictException("database with the same name already exists");
        }

        console.log(dbData);

        await dbData.save();
    }

    async edit(uuid: string, data: object, db: Db) {

        const dbName = await this.parseDbName(data);
        const dbs = await this.findByUserAndDb(uuid, db);

        let found = undefined;
        for(let i = 0; i < dbs.length; i++) {
            if(dbs[i].dataValues["data"]["connection_data"]["database"] === dbName) {
                found = dbs[i];
            }
        }

        if(!found) {
            throw new NotFoundException(`can't find database with name '${dbName}'`);
        }
        found.data = data;

        await found.save();
    }

    async findByUserAndDb(userId: string, db: Db): Promise<DbData[]> {
        return await this.dbDataRepo.findAll({ where: {userId, db} });
    }

    private async parseDbName(data: object): Promise<string> {
        if (data["connection_data"]["database"]) {
            return data["connection_data"]["database"];
        }
        if(data["connection_string"]) {
            return data["connection_string"].split("/")[3];
        }
        throw new NotFoundException;
    }

    async getDbInfo() {
        return dbInfo;
    }
}
