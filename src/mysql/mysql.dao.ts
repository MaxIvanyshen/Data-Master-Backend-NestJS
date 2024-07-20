import { SqlQueryConstructor } from "../sqlTools/sqlQueryConstructor";
import { DbData } from 'src/db-data/entity/db-data.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as mysql from "mysql2/promise";
import { DbRequest } from "src/db-requests/dbRequest";

export class MysqlDAO {

    public async connectToDB(dbData: DbData) {
        return mysql.createPool(dbData.data["connection_data"]);
    }

    public async insert(db: DbData, req: DbRequest) {
        const pool = await this.connectToDB(db);
        try {
            const [results, ] = await pool.execute(SqlQueryConstructor.makeInsertionQueryStr(req.data, req.table));
            return results;
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't insert into database");
        } finally {
            pool.end();
        }
    } 

    public async select(db: DbData, req: DbRequest) {
        const pool = await this.connectToDB(db);
        try {
            const [results, ] = await pool.execute(SqlQueryConstructor.makeSelectionQueryStr(req.data, req.table));
            return results;
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't select from database");
        } finally {
            pool.end();
        }
    } 

    public async delete(db: DbData, req: DbRequest) {
        const pool = await this.connectToDB(db);
        try {
            const [results, ] = await pool.execute(SqlQueryConstructor.makeDeletionQueryStr(req.data, req.table));
            return results;
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't delete from database");
        } finally {
            pool.end();
        }
    }

    public async update(db: DbData, req: DbRequest) {
        const pool = await this.connectToDB(db);
        try {
            const [results, ] = await pool.execute(SqlQueryConstructor.makeUpdateQueryStr(req.data, req.table));
            return results;
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't update database");
        } finally {
            pool.end();
        }
    }

    public async custom(db: DbData, req: DbRequest) {
        const pool = await this.connectToDB(db);
        try {
            const [results, ] = await pool.execute(req.data["query"]);
            return results;
        } catch(err: any) {
            throw new BadRequestException("invalid query");
        } finally {
            pool.end();
        }
    }

    public async getTables(dbData: DbData, db: string) {
        const pool = await this.connectToDB(dbData);
        try {
            const [results, ] = await pool.execute(`SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema = '${db}';`);
            return results;
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't update database");
        } finally {
            pool.end();
        }
    }
}
