import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';
import { UserController } from './user.controller';
import { DbDataService } from 'src/db-data/db-data.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { dbDataProviders } from 'src/providers/db-data.providers';
import { BlacklistService } from 'src/blacklist/blacklist.service';

@Module({
  providers: [
      UserService,
      DbDataService,
      TokenService,
      BlacklistService,
      JwtService,
      ...dbDataProviders,
      ...databaseProviders,
      ...usersProviders
  ],
  controllers: [UserController],
})
export class UserModule {}
