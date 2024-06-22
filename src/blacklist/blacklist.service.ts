import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class BlacklistService {
  private client;

  constructor() {
      this.client = createClient({
          password: process.env.REDIS_PASSWORD,
          socket: {
              host: process.env.REDIS_HOST,
              port: +process.env.REDIS_PORT,
          }
      });
      this.client.connect();
  }

  async addTokenToBlacklist(token: string): Promise<void> {
    await this.client.set(token, 'blacklisted');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.client.get(token);
    return result !== null
  }
}
