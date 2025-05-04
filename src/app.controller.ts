import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
// import { CacheRedisInterceptor } from './modules';

@Controller()
@CacheTTL(30)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  getHello(): any {
    return this.appService.getHello();
  }
}
