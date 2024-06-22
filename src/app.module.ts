import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from "cookie-parser";
import { AppController } from './app/app.controller';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { BlacklistService } from './blacklist/blacklist.service';
import { databaseProviders } from './providers/database.providers';
import { usersProviders } from './providers/users.providers';

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: ['.env.dev'],
          isGlobal: true,
      }),
      UserModule,
      AuthModule,
      JwtModule,
  ],
  controllers: [AppController],
  providers: [
      AuthGuard,
      UserService,
      JwtService,
      BlacklistService,
      ...databaseProviders,
      ...usersProviders,
  ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');
      }
}
