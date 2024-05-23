import { Module } from '@nestjs/common';
import { MicroserviceService } from './microservice.service';
import { MicroserviceController } from './microservice.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: 'main_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [MicroserviceController],
  providers: [MicroserviceService],
})
export class MicroserviceModule {}
