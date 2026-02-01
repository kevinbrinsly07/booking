import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private async checkConnection(): Promise<boolean> {
    if (!this.redis) return false;
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Acquire a distributed lock for booking operations
   * Uses Redis SET with NX (set if not exists) and EX (expiration)
   */
  async acquireLock(
    key: string,
    value: string,
    ttlSeconds: number = 30,
  ): Promise<boolean> {
    if (!(await this.checkConnection())) return true; // Allow operation if Redis unavailable
    try {
      const result = await this.redis.set(key, value, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch {
      return true; // Allow operation if Redis fails
    }
  }

  /**
   * Release a distributed lock
   */
  async releaseLock(key: string, value: string): Promise<boolean> {
    if (!(await this.checkConnection())) return true;
    try {
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      const result = await this.redis.eval(script, 1, key, value);
      return result === 1;
    } catch {
      return true;
    }
  }

  /**
   * Set a value with optional TTL
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!(await this.checkConnection())) return;
    try {
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch {
      // Silently fail if Redis unavailable
    }
  }

  /**
   * Get a value
   */
  async get(key: string): Promise<string | null> {
    if (!(await this.checkConnection())) return null;
    try {
      return await this.redis.get(key);
    } catch {
      return null;
    }
  }

  /**
   * Delete a key
   */
  async delete(key: string): Promise<void> {
    if (!(await this.checkConnection())) return;
    try {
      await this.redis.del(key);
    } catch {
      // Silently fail
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  /**
   * Increment a counter (useful for rate limiting)
   */
  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const value = await this.redis.incr(key);
    if (ttlSeconds && value === 1) {
      await this.redis.expire(key, ttlSeconds);
    }
    return value;
  }

  /**
   * Get multiple keys
   */
  async mget(keys: string[]): Promise<(string | null)[]> {
    return this.redis.mget(...keys);
  }

  /**
   * Set multiple keys
   */
  async mset(keyValues: Record<string, string>): Promise<void> {
    const args = Object.entries(keyValues).flat();
    await this.redis.mset(...args);
  }
}
