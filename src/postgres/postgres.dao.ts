import { Client } from 'pg';
import { SqlQueryConstructor } from "../sqlTools/sqlQueryConstructor";
import { SchemaConverter } from "../sqlTools/sqlSchemaConverter";
import { DbData } from 'src/db-data/entity/db-data.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { SqlRequest } from 'src/db-requests/sqlRequest';

export class PostgresDAO {
    public readonly OK = 0;
    public readonly ERROR = 1;

    private client: any = null;

    private schema: any = null;

    public async connectToDB(dbData: DbData): Promise<number> {
        if(dbData.data["connection_string"]) {
            this.client = new Client({ connectionString: dbData.data["connection_string"] });
        } else {
            this.client = new Client(dbData.data["connection_data"]);
        }
        let status: number = 0;
        this.client.connect((err: any) => {
            if (err) {
                throw new InternalServerErrorException("couldn't connect to database");
            };
        });
        return status;
    }

    private async disconnect() {
        this.client.end()
            .catch(() => { throw new InternalServerErrorException("couln't close the connection"); });
    }

    public async insert(db: DbData, req: SqlRequest) {
        await this.connectToDB(db);
        await this.client.query(SqlQueryConstructor.makeInsertionQueryStr(req.data, req.table))
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.disconnect();
    }

    public async select(db: DbData, req: SqlRequest): Promise<object> {
        await this.connectToDB(db);
        let queryStr = SqlQueryConstructor.makeSelectionQueryStr(req.data, req.table);
        const result = await this.client.query(queryStr);
        this.disconnect();
        return result.rows;
    }

    public async update(db: DbData, req: SqlRequest) {
        await this.connectToDB(db);
        await this.client.query(SqlQueryConstructor.makeUpdateQueryStr(req.data, req.table))
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.disconnect();
    }


    public async delete(db: DbData, req: SqlRequest) {
        await this.connectToDB(db);
        await this.client.query(SqlQueryConstructor.makeDeletionQueryStr(req.data, req.table))
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.disconnect();
    }

    public async custom(db: DbData, req: SqlRequest): Promise<object> {
        await this.connectToDB(db);
        const result = await this.client.query(req.data["query"])
            .catch(() => { throw new InternalServerErrorException("couldn't insert into the database"); });
        this.disconnect();
        return result.rows;
    }

        /*
    public async update(query: any, data: any): Promise<number> {
        if(this.schema == null)
            await this.getSchema();

        let status = this.OK;
        await this.client.query(SqlQueryConstructor.makeUpdateQueryStr(query, data, this.data.table)).catch((err: any) => {status = this.ERROR; console.log(err)});

        return status;

    }
    */

    private async getSchema(table: string): Promise<void> {
        const result = await this.client.query(`
                                               SELECT column_name, data_type 
                                               FROM information_schema.columns 
                                               WHERE table_name = '${table}'
                                               `);

                                               this.schema = result.rows;
                                               return SchemaConverter.convert(this.schema);
    }
}
