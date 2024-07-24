import { InternalServerErrorException } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { DbData } from 'src/db-data/entity/db-data.entity';
import { DbRequest } from 'src/db-requests/dbRequest';

export class MongoDAO {
    private client: any
    private database: any

    async connectToDB(db: DbData) {
        let uri = undefined;
        if(db.data["connection_string"]) {
            uri = db.data["connection_string"];
        }
        else if(db.data["connection_data"]) {
            uri = `mongodb+srv://${db.data["connection_data"]["user"]}:${db.data["connection_data"]["password"]}@${db.data["connection_data"]["cluster"]}.cmf0gre.mongodb.net/mydb?retryWrites=true&w=majority`;
        }

        if(!uri) {
            throw new InternalServerErrorException("couldn't connect to database. Invalid connection data");
        }
        this.client = new MongoClient(uri);
        try {
            await this.client.connect();
            this.database = await this.client.db(db.data["connection_data"]["database"]);
        } catch(e) {
            throw new InternalServerErrorException("couldn't connect to database");
        }
    }    

    async disconnect() {
        try {
            await this.client.close();
        } catch(e) {
            throw new InternalServerErrorException("couldn't connect to database");
        }
    }

    async select(db: DbData, req: DbRequest): Promise<object[]> {
        await this.connectToDB(db);
        const collection = await this.database.collection(req.table);
        const found: object[] = await collection.find(req.data["query"]).toArray();
        await this.disconnect();
        return found
    }

    async insert(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        const collection = await this.database.collection(req.table);
        await collection.insertOne(req.data["values"]);
        await this.disconnect();
    }

    async update(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        const collection = await this.database.collection(req.table);
        await collection.updateMany(req.data["query"], { $set: req.data["values"] });
        await this.disconnect();
    }

    async delete(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        const collection = await this.database.collection(req.table);
        await collection.deleteMany(req.data["query"]);
        await this.disconnect();
    }

    async getCollections(db: DbData) {
        await this.connectToDB(db);
        const collections = await this.database.listCollections().toArray();
        await this.disconnect();
        return collections;
    }

    async createCollection(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        await this.database.createCollection(req.table);
        await this.disconnect();
    }

    async dropCollection(db: DbData, req: DbRequest) {
        await this.connectToDB(db);
        await this.database.dropCollection(req.table);
        await this.disconnect();
    }

    async getOperationsCount(db: DbData) {
        await this.connectToDB(db);
        const adminDb = this.client.db().admin();
        const serverStatus = await adminDb.command({ serverStatus: 1 });
        const operationsCount = serverStatus.opcounters;
        await this.disconnect();

        return operationsCount;
    }

    async getActiveConnections(db: DbData) {
        await this.connectToDB(db);
        const adminDb = this.client.db().admin();
        const serverStatus = await adminDb.command({ serverStatus: 1 });
        await this.disconnect();
        return serverStatus.connections.current;
    }

    async getMemoryUsageData(db: DbData) {
        const collections = await this.getCollections(db);
        await this.connectToDB(db);
        const databaseTotal = (await this.database.stats()).dataSize;
        const collectionsSize = {};
        await collections.forEach(async (collection: any) => {
            const stats = await this.database.command({ collStats: collection.name });
            collectionsSize[collection.name] = stats.size;
        });

        return {
            databaseTotal,
            collections: collectionsSize
        }
    }
}
