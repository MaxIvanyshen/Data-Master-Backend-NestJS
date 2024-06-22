import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: jwtConstants.secret,
                secretOrPrivateKey: jwtConstants.secret,
            }),
        }),
    ],
    providers: [
        UserService,
        AuthService,
        JwtService,
        ...databaseProviders,
        ...usersProviders,
    ],
    controllers: [AuthController]
})
export class AuthModule {}
