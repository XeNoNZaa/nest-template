import { Module } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';
import { CacheRedisController } from './cache-redis.controller';
// import { CacheRedisInterceptor } from './cache-redis.interceptor';
// import { CacheModule } from '@nestjs/cache-manager';

// import appConfig from '@/config';

@Module({
  imports: [],
  controllers: [CacheRedisController],
  providers: [CacheRedisService],
  exports: [CacheRedisService],
})
export class CacheRedisModule {}
