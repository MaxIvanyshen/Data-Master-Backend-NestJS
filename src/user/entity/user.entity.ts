import { Column, Model, DataType, PrimaryKey, Table, Unique, BeforeSave, AllowNull } from "sequelize-typescript";
import * as bcrypt from 'bcrypt';

@Table({tableName: 'users'})
export class User extends Model {
    @PrimaryKey
    @Unique
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    }) 
    id: string;

    @Column
    loginType: LoginType
    
    @Column({
        type: "varchar" 
    })
    firstname: string;

    @Column({
        type: "varchar" 
    })
    lastname: string;

    @AllowNull
    @Column({
        type: "varchar" 
    })
    password: string;

    @Unique
    @Column({
        type: "varchar"
    })
    email: string;

    @Column
    accessToken: string

    @Column
    refreshToken: string

    @BeforeSave
    static async hashPassword(user: User) {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10); 
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}

export enum LoginType {
    Password = 1,
    Google,
}
