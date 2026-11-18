import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../../infrastructure/cache/redis.service';
import { RawQueryService } from '../../infrastructure/database/raw-query.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly db: RawQueryService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async check() {
    const [pgsql, redis] = await Promise.allSettled([
      this.db.query('SELECT 1'),
      this.redis.ping(),
    ]);
    const pgsqlUp = pgsql.status === 'fulfilled';
    const redisUp = redis.status === 'fulfilled' && redis.value === true;
    return {
      status: pgsqlUp && redisUp ? 'ok' : 'degraded',
      pgsql: pgsqlUp ? 'up' : 'down',
      redis: redisUp ? 'up' : 'down',
      uptimeSeconds: Math.round(process.uptime()),
    };
  }
}
