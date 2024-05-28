import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { config } from 'dotenv';
config();

@Injectable()
export class MicroserviceService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.QUEUE_URL],
        queue: 'main_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }
  public send(pattern: string, data: any) {
    return this.client.send(pattern, data).toPromise();
  }
}
