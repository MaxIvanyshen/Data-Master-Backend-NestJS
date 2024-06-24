import { InternalServerErrorException } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { DbData } from 'src/db-data/entity/db-data.entity';
import { MongoRequest } from 'src/db-requests/mongoRequest';

export class MongoDAO {

    private client: any
    private database: any

    public async connectToDB(db: DbData) {
        this.client = new MongoClient(db.data["connection_string"]);
        try {
            await this.client.connect();
            this.database = this.client.db(db.data["connection_data"]["database"]);
        } catch(e) {
            throw new InternalServerErrorException("couldn't connect to database");
        }
    }    

    public async disconnect() {
        try {
            await this.client.close();
        } catch(e) {
            throw new InternalServerErrorException("couldn't connect to database");
        }
    }

    public async select(db: DbData, req: MongoRequest): Promise<object[]> {
        await this.connectToDB(db);
        const collection = await this.database.collection(req.collection);
        const found: object[] = await collection.find(req.data["query"]).toArray();
        await this.disconnect();
        return found
    }

    public async insert(db: DbData, req: MongoRequest) {
        await this.connectToDB(db);
        const collection = await this.database.collection(req.collection);
        await collection.insertOne(req.data["values"]);
        await this.disconnect();
    }
}
