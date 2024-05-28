import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { INestApplication } from '@nestjs/common';
// import * as httpMocks from 'node-mocks-http';
// import { request } from 'http';
// import * as request from 'supertest';
// import { MicroserviceService } from 'src/microservice/microservice.service';
import { CreateUserDto } from './dto/user.dto';

/* eslint-disable no-unused-vars */
/* @typescript-eslint/no-unused-vars */
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  // let rabbitService: MicroserviceService
  // let app: INestApplication;

  const mockUserService = {
    create: jest.fn(),
    getUser: jest.fn(),
    retrieveImage: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'johndoe@testmail.com',
      avatar: 'https://random-image.png',
      job: 'banker',
    };
    const result = {
      responseCode: 201,
      status: true,
      message: 'user creation successful!',
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        job: 'neurosurgeon',
        _id: '664b2eb7cb509c4b09997718',
      },
      meta: null,
    };
    jest.spyOn(service, 'create');
    expect(controller.create(createUserDto)).toEqual(result);
  });

  it('should retrieve user data in JSON representation', async () => {
    const result = {
      responseCode: 200,
      status: true,
      message: 'user now retrieved...',
      data: {
        id: 3,
        email: 'emma.wong@reqres.in',
        first_name: 'Emma',
        last_name: 'Wong',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      },
      meta: null,
    };
    jest.spyOn(service, 'findOne').mockImplementation(async () => result);

    expect(await controller.getUser('4', result)).toEqual(result);
  });

  it('should retrieve a user by avatar url', async () => {
    const result = {
      responseCode: 200,
      status: true,
      message: 'encoded image successfully retrieved...',
      data: {
        image: 'aHR0cHM6Ly9yZXFyZXMuaW4vaW1nL2ZhY2VzLzUtaW1hZ2UuanBn',
      },
      meta: null,
    };
    jest.spyOn(service, 'findOne').mockImplementation(async () => result);
    expect(await controller.getUser('4', result)).toEqual(result);
  });

  it('should delete a user', async () => {
    const result = {
      responseCode: 201,
      status: false,
      message: 'user deleted successfully',
      data: null,
      meta: null,
    };

    jest.spyOn(service, 'remove').mockImplementation(async () => result);

    expect(await controller.getUser('4', result)).toEqual(result);
  });
  // it('/api/users ', () => {
  //   return request(app.getHttpServer())
  //     .post('/api/users')
  //     .send({
  //       responseCode: 200,
  //       status: true,
  //       message: 'user now retrieved...',
  //       data: {
  //         id: 7,
  //         email: 'michael.lawson@reqres.in',
  //       "first_name": "Michael",
  //       "last_name": "Lawson",
  //       "avatar": "https://reqres.in/img/faces/7-image.jpg"
  //     },
  //       meta: null,
  // })
  // .expect(201);
  // });
});
