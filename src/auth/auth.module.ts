import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { TokenService } from 'src/token/token.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { OAuthController } from './oauth.controller';
import { DbDataService } from 'src/db-data/db-data.service';
import { dbDataProviders } from 'src/providers/db-data.providers';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'google' }),
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
        BlacklistService,
        TokenService,
        GoogleStrategy,
        DbDataService,
        ...databaseProviders,
        ...usersProviders,
        ...dbDataProviders,
    ],
    controllers: [AuthController, OAuthController],
})
export class AuthModule {}
