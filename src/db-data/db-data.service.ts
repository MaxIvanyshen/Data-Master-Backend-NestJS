import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Db, DbData } from './entity/db-data.entity';

@Injectable()
export class DbDataService {
    constructor(
        @Inject("DB_DATA_REPOSITORY")
        private readonly dbDataRepo: typeof DbData,
    ){}

    async save(uuid: string, data: object, db: Db) {
        const dbData = new DbData();

        dbData.id = await this.dbDataRepo.count() + 1;
        dbData.userId = uuid;
        dbData.data = data;
        dbData.db = db;

        const dbName = await this.parseDbName(dbData.data);
        const dbs = await this.findByUserAndDb(uuid, db);
        const found = dbs.find(async (x) => {
            await this.parseDbName(x.data) === dbName;
        });

        if(found) {
            throw new ConflictException("database with the same name already exists");
        }

        await dbData.save();
    }

    async findByUserAndDb(userId: string, db: Db): Promise<DbData[]> {
        return await this.dbDataRepo.findAll({ where: {userId, db} });
    }

    private async parseDbName(data: object): Promise<string> {
        if(data["connection_string"]) {
            return data["connection_string"].split("/")[3];
        }
        return data["connection_data"]["database"];
    }
}
