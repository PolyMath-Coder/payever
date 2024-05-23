import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { INestApplication } from '@nestjs/common';
// import { request } from 'http';
import * as request from 'supertest'

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('/api/users ', () => {
    return request(app.getHttpServer())
    .post('/api/users')
    .send({  
      "responseCode": 200,
      "status": true,
      "message": "user now retrieved..",
      "data": {
        "id": 7,
        "email": "michael.lawson@reqres.in",
        "first_name": "Michael",
        "last_name": "Lawson",
        "avatar": "https://reqres.in/img/faces/7-image.jpg"
      },
      "meta": null
  })
  .expect(201);

   
  });

});
