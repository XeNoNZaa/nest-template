import { Controller } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';

@Controller()
export class CacheRedisController {
  constructor(private readonly cacheRedisService: CacheRedisService) {}
}
