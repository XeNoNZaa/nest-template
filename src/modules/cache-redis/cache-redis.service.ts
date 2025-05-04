import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheRedisService {
  private readonly logger = new Logger(CacheRedisService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.logger.log('CacheRedisService initialized');
    console.log('this.cacheManager', this.cacheManager);
  }

  set(key: string, value: any, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }
  get(key: string) {
    return this.cacheManager.get(key);
  }
  del(key: string) {
    return this.cacheManager.del(key);
  }
  getCacheManager() {
    return this.cacheManager;
  }
}
