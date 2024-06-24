import { Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongoController } from './mongo.controller';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { DbDataService } from 'src/db-data/db-data.service';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';
import { dbDataProviders } from 'src/providers/db-data.providers';
import { MongoDAO } from './mongo.dao';

@Module({
  providers: [
      MongoService,
      MongoDAO,
      UserService,
      TokenService,
      JwtService,
      BlacklistService,
      DbDataService,
      ...databaseProviders,
      ...usersProviders,
      ...dbDataProviders
  ],
  controllers: [MongoController]
})
export class MongoModule {}
