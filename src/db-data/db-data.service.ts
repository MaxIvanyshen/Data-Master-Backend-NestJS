import { Injectable, Inject } from '@nestjs/common';
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
        await dbData.save();
    }

    async findByUserAndDb(userId: string, db: Db): Promise<DbData[]> {
        return await this.dbDataRepo.findAll({ where: {userId, db} });
    }
}
