import { IsEmail, NotEmpty, Column } from "sequelize-typescript";

export class UserDto {
    @NotEmpty
    @Column
    id: string

    @NotEmpty
    @Column
    firstname: string;

    @NotEmpty
    @Column
    lastname: string;
    
    @NotEmpty
    @Column
    password: string

    @IsEmail
    @NotEmpty
    @Column
    email: string
}
