import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { randomUUID } from 'crypto';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

/**
 * Base Redis service. Keys are automatically prefixed (REDIS_KEY_PREFIX) by
 * the client, so pass bare keys like `wallet:123:balance`.
 * The raw ioredis client is exposed as `client` for anything not wrapped here.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) public readonly client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) await this.client.set(key, value, 'EX', ttlSeconds);
    else await this.client.set(key, value);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async del(...keys: string[]): Promise<number> {
    return keys.length ? this.client.del(...keys) : 0;
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    return (await this.client.expire(key, ttlSeconds)) === 1;
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /** Cache-aside helper: return cached value or compute, store, and return it. */
  async remember<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
    const cached = await this.getJson<T>(key);
    if (cached !== null) return cached;
    const fresh = await loader();
    await this.setJson(key, fresh, ttlSeconds);
    return fresh;
  }

  /**
   * Simple single-instance lock (SET NX PX). Returns a release function, or
   * null if the lock is already held. Good for idempotency guards and cron
   * de-duplication; use Redlock if you need multi-node guarantees.
   */
  async acquireLock(key: string, ttlMs: number): Promise<(() => Promise<void>) | null> {
    const token = randomUUID();
    const ok = await this.client.set(`lock:${key}`, token, 'PX', ttlMs, 'NX');
    if (ok !== 'OK') return null;
    const releaseScript =
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
    return async () => {
      await this.client.eval(releaseScript, 1, `lock:${key}`, token);
    };
  }

  async ping(): Promise<boolean> {
    return (await this.client.ping()) === 'PONG';
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
