import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class TokenService {
   constructor(private jwtService: JwtService) {}

  async extractTokenFromHeader(request: Request): Promise<string> | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getUUID(token: string): Promise<string> | undefined {
      if(!token) {
          return undefined
      }
      try {
          const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
          return payload.sub;
      } catch (e) {
          throw new UnauthorizedException("invalid token");
      }
  }
}
