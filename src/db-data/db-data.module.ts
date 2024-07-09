import { Module } from '@nestjs/common';
import { DbDataService } from './db-data.service';
import { databaseProviders } from 'src/providers/database.providers';
import { dbDataProviders } from 'src/providers/db-data.providers';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { usersProviders } from 'src/providers/users.providers';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { DbDataController } from './db-data.controller';

@Module({
  providers: [
      DbDataService,
      UserService,
      AuthGuard,
      BlacklistService,
      TokenService,
      JwtService,
      ...databaseProviders,
      ...dbDataProviders,
      ...usersProviders
  ],
  controllers: [DbDataController],
})
export class DbDataModule {}
