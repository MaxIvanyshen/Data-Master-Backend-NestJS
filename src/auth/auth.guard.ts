import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { TokenService } from 'src/token/token.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private usersService: UserService,
      private blacklistService: BlacklistService,
      private tokenService: TokenService,

      @Inject(CACHE_MANAGER)
      private cacheManager: Cache
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.tokenService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const uuid = await this.tokenService.getUUID(token);
      const cachedUUID = await this.cacheManager.get(token);
      if(cachedUUID) {
          return cachedUUID === uuid;
      }
      const user = await this.usersService.findByUUID(uuid);
      if(!user || user.accessToken !== token ||
         await this.blacklistService.isTokenBlacklisted(user.accessToken)) {
          throw new UnauthorizedException('Invalid access token')
      }

      await this.cacheManager.set(token, uuid, +process.env.TOKEN_CACHE_TTL);

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

}
