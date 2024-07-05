import { Module } from '@nestjs/common';
import { DbDataService } from './db-data.service';
import { databaseProviders } from 'src/providers/database.providers';
import { dbDataProviders } from 'src/providers/db-data.providers';

@Module({
  providers: [DbDataService, ...databaseProviders, ...dbDataProviders],
})
export class DbDataModule {}
