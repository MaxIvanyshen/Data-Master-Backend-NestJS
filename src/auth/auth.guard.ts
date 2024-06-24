import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private usersService: UserService,
      private blacklistService: BlacklistService,
      private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.tokenService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const uuid = await this.tokenService.getUUID(token);
      if(!uuid) {
          throw new UnauthorizedException('Invalid refresh token')
      }
      const user = await this.usersService.findByUUID(uuid);
      if(!user || user.accessToken !== token ||
         await this.blacklistService.isTokenBlacklisted(user.accessToken)) {
          throw new UnauthorizedException('Invalid refresh token')
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

}
