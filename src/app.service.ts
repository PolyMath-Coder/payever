import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      status: true,
      message: 'payever to the world',
    };
  }
}
