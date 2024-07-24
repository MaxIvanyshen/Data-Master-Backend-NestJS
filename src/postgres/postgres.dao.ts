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

    public async getOperationsCount(db: DbData) {
        await this.connectToDB(db)
        const result = await this.client.query(`
                                               SELECT
                                                   SUM(CASE WHEN query LIKE 'SELECT%' THEN calls ELSE 0 END) AS select_count,
                                                   SUM(CASE WHEN query LIKE 'INSERT%' THEN calls ELSE 0 END) AS insert_count,
                                                   SUM(CASE WHEN query LIKE 'UPDATE%' THEN calls ELSE 0 END) AS update_count,
                                                   SUM(CASE WHEN query LIKE 'DELETE%' THEN calls ELSE 0 END) AS delete_count,
                                                   SUM(CASE WHEN query NOT LIKE 'SELECT%' AND query NOT LIKE 'INSERT%' AND query NOT LIKE 'UPDATE%' AND query NOT LIKE 'DELETE%' THEN calls ELSE 0 END) AS other_count
                                               FROM
                                                   pg_stat_statements;
                                               `)
            .catch(() => { throw new InternalServerErrorException("can't parse database statistics") });
        this.client.release();
        return result.rows[0];
    }

    public async getActiveConnections(db: DbData) {
        await this.connectToDB(db)
        const result = await this.client.query(`SELECT COUNT(*)
            FROM pg_stat_activity WHERE datname = '${db.data["connection_data"]["database"]}';`)
            .catch(() => { throw new InternalServerErrorException("can't parse database statistics") });
        this.client.release();
        return result.rows[0].count;
    }

    public async getMemoryUsageData(db: DbData) {
        await this.connectToDB(db)
        let result = await this.client.query(`
                   SELECT pg_size_pretty(pg_database_size('${db.data["connection_data"]["database"]}')) AS database_size;`)
            .catch(() => { throw new InternalServerErrorException("can't parse database statistics") });
        const totalDbSize = result.rows[0].database_size;
        result = await this.client.query(`
                                         SELECT
                                         table_name,
                                         pg_size_pretty(total_size) AS size
                                         FROM (
                                             SELECT
                                             c.relname AS table_name,
                                             pg_total_relation_size(c.oid) AS total_size
                                             FROM
                                             pg_class c
                                             LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
                                             WHERE
                                             c.relkind = 'r' -- Only tables
                                             AND n.nspname NOT IN ('pg_catalog', 'information_schema') -- Exclude system schemas
                                         ) 
                                         ORDER BY total_size DESC;`)
            .catch(() => { throw new InternalServerErrorException("can't parse database statistics") });
        const tablesSize = result.rows;
        this.client.release();
        return {
            databaseTotal: totalDbSize,
            tables: tablesSize,
        }
    }
}
