import { Column, Model, DataType, PrimaryKey, Table, Unique, BeforeSave } from "sequelize-typescript";
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
    
    @Column({
        type: "varchar" 
    })
    firstname: string;

    @Column({
        type: "varchar" 
    })
    lastname: string;

    @Column({
        type: "varchar" 
    })
    password: string;

    @Unique
    @Column({
        type: "varchar"
    })
    email: string;

    @BeforeSave
    static async hashPassword(user: User) {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10); 
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}
