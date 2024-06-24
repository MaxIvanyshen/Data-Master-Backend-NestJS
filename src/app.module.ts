import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from "cookie-parser";
import { AuthGuard } from './auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { BlacklistService } from './blacklist/blacklist.service';
import { databaseProviders } from './providers/database.providers';
import { usersProviders } from './providers/users.providers';
import { PostgresModule } from './postgres/postgres.module';
import { TokenService } from './token/token.service';
import { DbDataModule } from './db-data/db-data.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbData } from './db-data/entity/db-data.entity';
import { User } from './user/entity/user.entity';
import { MysqlModule } from './mysql/mysql.module';
import { MongoModule } from './mongo/mongo.module';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: ['.env.dev'],
          isGlobal: true,
      }),
      CacheModule.register({
          isGlobal: true,
          ttl: +process.env.RESPONSE_CACHE_TTL,
          max: +process.env.MAX_CACHE,
      }),
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        autoLoadModels: true,
        synchronize: true,
        models: [User, DbData],
      }),
      UserModule,
      AuthModule,
      JwtModule,
      PostgresModule,
      DbDataModule,
      MysqlModule,
      MongoModule,
  ],
  providers: [ 
      AuthGuard,
      UserService,
      JwtService,
      BlacklistService,
      ...databaseProviders,
      ...usersProviders,
      TokenService,
      {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
      },
  ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');
      }
}
