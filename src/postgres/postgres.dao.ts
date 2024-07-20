import { Pool } from 'pg';
import { SqlQueryConstructor } from "../sqlTools/sqlQueryConstructor";
import { DbData } from 'src/db-data/entity/db-data.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DbRequest } from 'src/db-requests/dbRequest';

export class PostgresDAO {
    public readonly OK = 0;
    public readonly ERROR = 1;

    private client: any = null;

    public async connectToDB(dbData: DbData) {
        if(dbData.data["connection_string"]) {
            this.client = await new Pool({ connectionString: dbData.data["connection_string"] }).connect();
        } else {
            this.client = await new Pool(dbData.data["connection_data"]).connect();
        }
    }

    public async insert(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        await this.client.query(SqlQueryConstructor.makeInsertionQueryStr(req.data, req.table))
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.client.release();
    }

    public async select(db: DbData, req: DbRequest): Promise<object> {
        await this.connectToDB(db);
        let queryStr = SqlQueryConstructor.makeSelectionQueryStr(req.data, req.table);
        const result = await this.client.query(queryStr);
        return result.rows;
    }

    public async update(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        await this.client.query(SqlQueryConstructor.makeUpdateQueryStr(req.data, req.table))
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.client.release();
    }


    public async delete(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        await this.client.query(SqlQueryConstructor.makeDeletionQueryStr(req.data, req.table))
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.client.release();
    }

    public async custom(db: DbData, req: DbRequest): Promise<object> {
        await this.connectToDB(db);
        const result = await this.client.query(req.data["query"])
            .catch(() => { throw new BadRequestException("invalid query"); });
        this.client.release();
        return result.rows;
    }

    public async getTables(db: DbData, req: DbRequest): Promise<object> {
        await this.connectToDB(db);
        const result = await this.client.query(`SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                    AND table_type = 'BASE TABLE';`)
            .catch(() => { throw new InternalServerErrorException("couldn't select from the database"); });
        this.client.release();
        let tableNames = []
        for(let i = 0; i < result.rows.length; i++) {
            tableNames.push(result.rows[i].table_name);
        }
        return tableNames;
    }
}
