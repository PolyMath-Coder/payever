import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  private store: Map<string, any> = new Map();

  set(key: string, value: any): void {
    this.store.set(key, value);
  }

  get(key: string) {
    return this.store.get(key);
  }
}
