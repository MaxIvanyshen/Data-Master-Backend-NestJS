import { Injectable } from '@nestjs/common';
import * as Redis from "redis"

@Injectable()
export class BlacklistService {
    private readonly client
    

    constructor() {
        this.client = Redis.createClient({
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
        await this.client.expire(token, +process.env.BLACKLIST_TOKEN_TTL);
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const result = await this.client.exists(token);
        return result === 1
    }
}
