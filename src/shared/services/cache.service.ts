import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutos por defecto
      checkperiod: 60, // Revisar expiración cada minuto
    });
  }

  set(key: string, value: any, ttl?: number): boolean {
    return this.cache.set(key, value, ttl);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }
}
