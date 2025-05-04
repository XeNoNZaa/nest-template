import { CacheInterceptor } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheRedisInterceptor extends CacheInterceptor {
  // Optionally override intercept method here
}
