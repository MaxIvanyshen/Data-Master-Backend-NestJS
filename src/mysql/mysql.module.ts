import { Module } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { MysqlController } from './mysql.controller';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { DbDataService } from 'src/db-data/db-data.service';
import { MysqlDAO } from './mysql.dao';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';
import { dbDataProviders } from 'src/providers/db-data.providers';

@Module({
  providers: [
      MysqlService,
      UserService,
      TokenService,
      JwtService,
      BlacklistService,
      DbDataService,
      MysqlDAO,
      ...databaseProviders,
      ...usersProviders,
      ...dbDataProviders
  ],
  controllers: [MysqlController]
})
export class MysqlModule {}
