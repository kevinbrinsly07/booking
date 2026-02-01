import { Module, Global, DynamicModule } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = {
      provide: REDIS_CLIENT,
      useFactory: () => {
        try {
          const redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            lazyConnect: true,
            retryStrategy: (times) => {
              // Stop retrying after 3 attempts
              if (times > 3) {
                console.warn('⚠️  Redis not available - running without caching');
                return null;
              }
              const delay = Math.min(times * 50, 2000);
              return delay;
            },
          });

          // Try to connect but don't fail if it doesn't work
          redis.connect().catch(() => {
            console.warn('⚠️  Redis connection failed - app will run without caching');
          });

          return redis;
        } catch (error) {
          console.warn('⚠️  Redis initialization failed - app will run without caching');
          return null;
        }
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [REDIS_CLIENT, RedisService],
    };
  }
}
