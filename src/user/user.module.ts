import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { databaseProviders } from 'src/providers/database.providers';
import { usersProviders } from 'src/providers/users.providers';

@Module({
  providers: [UserService, ...databaseProviders, ...usersProviders],
})
export class UserModule {}
