import { Unique, PrimaryKey, AutoIncrement, Column, DataType, Table, Model } from "sequelize-typescript";

@Table({ tableName: "db_data" })
export class DbData extends Model {

    @Unique
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        type: DataType.UUID
    })
    userId: string;

    @Column
    db: number;

    @Column({
        type: DataType.JSONB
    })
    data: object;
}

export enum Db {
    PostgreSQL = 1,
    MySQl,
    MongoDB,
}
