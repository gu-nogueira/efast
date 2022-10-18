import Redis from 'ioredis';

class Cache {
  constructor() {
    /*
     *  Redis connection
     */

    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      // Usamos um prefix para identificar nosso cache de forma única
      keyPrefix: 'cache:',
    });
  }

  set(key, value) {
    // 'EX' invalida nosso cache após um tempo determinado (60 * 60 * 24 = 1 dia)
    return this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }
}

export default new Cache();
