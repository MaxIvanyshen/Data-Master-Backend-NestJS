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

    public async getOperationsCount(db: DbData) {
        const pool = await this.connectToDB(db);
        try {
            const [result, ] = await pool.execute(`
                SELECT VARIABLE_NAME, VARIABLE_VALUE
                FROM information_schema.GLOBAL_STATUS
                WHERE VARIABLE_NAME IN ('Com_insert', 'Com_update', 'Com_delete', 'Com_select')

                UNION ALL

                SELECT 'COM_OTHER' AS VARIABLE_NAME,
                       SUM(VARIABLE_VALUE) AS VARIABLE_VALUE
                FROM information_schema.GLOBAL_STATUS
                WHERE VARIABLE_NAME LIKE 'Com_%'
                AND VARIABLE_NAME NOT IN ('Com_insert', 'Com_update', 'Com_delete', 'Com_select');
                                                   `);
            return result;
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't update database");
        } finally {
            pool.end();
        }
    }

    public async getActiveConnections(db: DbData) {
        const pool = await this.connectToDB(db);
        try {
            const [result, ] = await pool.execute(`

                SELECT COUNT(*) AS active_connections
                FROM information_schema.PROCESSLIST
                WHERE COMMAND != 'Sleep';
                                                   `);
            return result[0]["active_connections"];
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't update database");
        } finally {
            pool.end();
        }
    }
    public async getMemoryUsageData(db: DbData) {
        const pool = await this.connectToDB(db);
        try {
            const [totalDbSizeResult, ] = await pool.execute(`
                                                             SELECT 
                                                             'Total Size of Database (bytes)' AS metric,
                                                             ROUND(SUM(data_length + index_length), 2) AS size_bytes
                                                             FROM 
                                                             information_schema.TABLES
                                                             WHERE 
                                                             table_schema = '${db.data["connection_data"]["database"]}';
                                                                  `);
            const totalDbSize = totalDbSizeResult[0]["size_bytes"];

            const [tableSizeResult, ] = await pool.execute(`
                                                           SELECT 
                                                           table_name,
                                                           ROUND((data_length + index_length), 2) AS table_size_bytes
                                                           FROM 
                                                           information_schema.TABLES
                                                           WHERE 
                                                           table_schema = '${db.data["connection_data"]["database"]}'
                                                           ORDER BY 
                                                           table_size_bytes DESC;
                                                           `);
            const tablesSize = tableSizeResult;
            return {
                totalDbSize,
                tablesSize
            }
        } catch(err: any) {
            throw new InternalServerErrorException("couldn't update database");
        } finally {
            pool.end();
        }
    }
}
