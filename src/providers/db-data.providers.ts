import { DbData } from "src/db-data/entity/db-data.entity";

export const dbDataProviders = [
    {
        provide: "DB_DATA_REPOSITORY",
        useValue: DbData,
    },
];
