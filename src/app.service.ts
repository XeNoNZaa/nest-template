/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable } from '@nestjs/common';
import { CacheRedisService } from './modules';

@Injectable()
export class AppService {
  constructor(private readonly cacheService: CacheRedisService) {}

  async getHello(): Promise<string> {
    let cacheHello: any = await this.cacheService.get('hello');
    if (!cacheHello) {
      await this.cacheService.set('hello', Date.now().toString(), { ttl: 10 } as any);
      cacheHello = await this.cacheService.get('hello');
    }
    return `Hello World! ${cacheHello} ${Date.now()}`; // Return the current timestamp
  }
}
