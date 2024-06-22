import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from "cookie-parser";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: ['.env.dev'],
          isGlobal: true,
      }),
      UserModule,
      AuthModule,
  ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');
      }
}
