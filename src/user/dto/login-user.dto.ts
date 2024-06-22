import { Column, NotEmpty, IsEmail } from "sequelize-typescript"

export class LoginUserDto {
    @NotEmpty
    @IsEmail
    @Column
    readonly email: string

    @NotEmpty
    @Column
    readonly password: string
}
