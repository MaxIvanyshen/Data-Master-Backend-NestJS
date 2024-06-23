import { Module } from '@nestjs/common';
import { PostgresController } from './postgres.controller';
import { PostgresService } from './postgres.service';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { DbDataService } from 'src/db-data/db-data.service';
import { dbDataProviders } from 'src/providers/db-data.providers';
import { PostgresDAO } from './postgres.dao';

@Module({
  controllers: [PostgresController],
  providers: [
      PostgresService,
      UserService,
      TokenService,
      JwtService,
      BlacklistService,
      DbDataService,
      PostgresDAO,
      ...databaseProviders,
      ...usersProviders,
      ...dbDataProviders
  ]
})
export class PostgresModule {}
