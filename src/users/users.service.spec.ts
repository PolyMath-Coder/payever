import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { MicroserviceService } from 'src/microservice/microservice.service';
import { CreateUserDto } from './dto/user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorResponse } from 'src/shared/constants/responses/error';
import { RedisService } from 'src/shared/constants/redis.service';
import axios from 'axios';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { ImageEntity } from './entities/image.entity';
import { ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import { sendEmail } from 'src/shared/constants/email';
import { SuccessResponse } from 'src/shared/constants/responses/success';

jest.mock('axios');
jest.mock('fs')
jest.mock('crypto')
jest.mock('path');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedCrypto = crypto as jest.Mocked<typeof crypto>;
const mockedPath = path as jest.Mocked<typeof path>;

const mockUserRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn()
}

const mockImageRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
}

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<UserEntity>
  let imageRepo: Repository<ImageEntity>
  let rabbitService: MicroserviceService
  let redisService: RedisService
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, 
        RedisService,
      {
        provide: getRepositoryToken(UserEntity),
        useValue: mockUserRepository,
        useClass: Repository
      },
      {
        provide: getRepositoryToken(ImageEntity),
        useValue: mockImageRepository
      }
    ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    redisService = module.get<RedisService>(RedisService)
    userRepo = module.get(getRepositoryToken(UserEntity))
    let rabbitService = module.get<MicroserviceService>(MicroserviceService);
    imageRepo = module.get(getRepositoryToken(ImageEntity))
  });


 

  // it('should create a user, send an email, and publish an event', async () => {
  //   const createUserDto: CreateUserDto = { email: 'test@example.com', name: 'password', avatar: 'https://avatar.png', job: '' };
    
  //   const result = await service.create(createUserDto);

  //   expect(userRepo.save).toHaveBeenCalledWith(createUserDto);
  //   expect(sendEmail).toHaveBeenCalledWith('test@example.com');
  //   expect(rabbitService.send).toHaveBeenCalledWith('1');
  //   expect(result).toEqual({ id: '1', email: 'test@example.com' });
  // });




 describe('creates a user', () => {

  it('should return if user already exists.', async  () => {
    const createUserDto: CreateUserDto = {
      name: 'Janet Doe',
      email: 'janetdoe@gmail.com',
      avatar: 'https://janetdoe.png',
      job: 'banker'
    }
    
    jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
    const result = await service.create(createUserDto)
    expect(result).toEqual({
      statusCode: 404,
      message: 'Oops! user already exists',
      data: null,
      meta: null
    })
  })

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = { email: 'test@example.com', name: 'password', avatar: 'https://avatar.png', job: 'banker' };
  
    const result = await service.create(createUserDto);

    expect(userRepo.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
    expect(userRepo.save).toHaveBeenCalledWith(createUserDto);
    expect(sendEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(rabbitService.send).toHaveBeenCalledWith(createUserDto.name, createUserDto);
    expect(result).toEqual(SuccessResponse(201, 'User creation successful!', { id: 1, ...createUserDto }, null));
  });
})


describe('findOne', () => {
  it('should return a user if cache exists', async () => {
    const userId = '1';
        const cachedUser = { id: '1', name: 'John Doe' };
        (redisService.get as jest.Mock).mockResolvedValue(cachedUser);
  
        const result = await service.findOne(userId);
        expect(result).toEqual({
          status: 200,
          message: 'user now retrieved..',
          data: cachedUser,
          error: null,
        });
        expect(redisService.get).toHaveBeenCalledWith(userId);
        expect(redisService.set).not.toHaveBeenCalled();
  })

  it('should return an API if not in cache and then cache it', async () => {
    const userId = '2';
    const apiResponse = { data: { data: { id: '2', name: 'Jane Doe' } } };
    (redisService.get as jest.Mock).mockResolvedValue(null);
    mockedAxios.get.mockResolvedValue(apiResponse);

    const result = await service.findOne(userId);

    expect(result).toEqual({
      status: 200,
      message: 'user now retrieved..',
      data: apiResponse.data.data,
      error: null,
    });
    expect(redisService.get).toHaveBeenCalledWith(userId);
    expect(mockedAxios.get).toHaveBeenCalledWith(`https://reqres.in/api/users/${userId}`);
    expect(redisService.set).toHaveBeenCalledWith(userId, apiResponse.data.data);
  })

  it('should return an error response if an exception occurs.', async () => {
    const userId = '3';
    (redisService.get as jest.Mock).mockResolvedValue(null);
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    const result = await service.findOne(userId);

    expect(result).toEqual({
      status: 400,
      message: 'unable to retrieve user',
      data: null,
      error: null,
    });
    expect(redisService.get).toHaveBeenCalledWith(userId);
    expect(mockedAxios.get).toHaveBeenCalledWith(`https://reqres.in/api/users/${userId}`);
    expect(redisService.set).not.toHaveBeenCalled();
  })

})





  it('should create a user, send an email, and publish an event', async () => {
    expect(service).toBeDefined();
    const createUserDto: CreateUserDto = { email: 'test@example.com', name: 'John Doe', avatar: 'https://random-image.png', job: 'lawyer' };
    const result= await service.create(createUserDto);
    expect(result).toEqual({
      statusCode: 201,
      message: 'user creation successful!',
      data: createUserDto,
      meta: null
    })
    expect(userRepo).toHaveBeenLastCalledWith(createUserDto);
    expect(rabbitService.send).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({ "name": "John Doe", "email": "johndoe@gmail.com", "job": "neurosurgeon", "_id": "664b2eb7cb509c4b09997718" });
  });
 })


describe('retrieveImageFile', async () => {
  let service: UsersService;
  let imageRepo: Repository<ImageEntity>
  it('should return base64 encoded image from local storage if exists', async () => {
    const _id  = '840940fiowi5ed904909'
    const userId = '1';
    const hash = 'fake-hash';
    const filePath = 'path/to/image.png'
    const image = { userId: userId, filePath: 'path/to/image.png', hash: hash, _id: new Object(_id) };
    const newImageInstance = new ImageEntity ()
    newImageInstance.userId = userId
    newImageInstance.hash = hash
    newImageInstance.filePath = filePath

    const imageBuffer = Buffer.from('fake-image-data');
    jest.spyOn(imageRepo, 'findOneBy').mockResolvedValue(newImageInstance)
    mockedFs.readFileSync.mockReturnValue(imageBuffer);

    const result = await service.retrieveImageFile(userId);

    expect(result).toEqual({
      status: 200,
      message: 'encoded image successfully retrieved...',
      data: { image: imageBuffer.toString('base64') },
      meta: null,
    });
    expect(imageRepo.findOneBy).toHaveBeenCalledWith({ userId });
    expect(mockedFs.readFileSync).toHaveBeenCalledWith('path/to/image.png');
  });

})

describe('remove', ()=> {
  let service: UsersService;
  let imageRepo: Repository<ImageEntity>
  it('should return 404 if user avatar is not found', async () => {
    const userId = '1';
    jest.spyOn(imageRepo, 'findOneBy').mockResolvedValue(null);

    const result = await service.remove(userId);

    expect(result).toEqual({
      status: 404,
      message: 'user avatar not found...',
      data: null,
      error: null,
    });
    expect(imageRepo.findOneBy).toHaveBeenCalledWith({ userId });
  });

  it('should delete the user avatar and return 200 on success', async () => {
    const userId = '2';
    const image = { userId, filePath: 'path/to/image.png' };
    jest.spyOn(imageRepo, 'findOneBy').mockResolvedValue(null);
   // jest.spyOn(imageRepo, 'delete').mockResolvedValue(ImageEntit);

    const result = await service.remove(userId);

    expect(result).toEqual({
      status: 200,
      message: 'user deleted successfully',
      data: null,
      error: null,
    });
    expect(imageRepo.findOneBy).toHaveBeenCalledWith({ userId });
    expect(mockedFs.unlinkSync).toHaveBeenCalledWith(image.filePath);
    expect(imageRepo.delete).toHaveBeenCalledWith({ userId });
  });

  it('should return 400 if an exception occurs', async () => {
    const userId = '3';
    jest.spyOn(imageRepo, 'findOneBy').mockRejectedValue(ErrorResponse(404, 'unable to retrieve user', null, null));

    const result = await service.remove(userId);

    expect(result).toEqual({
      status: 400,
      message: null,
      data: null,
      error: null,
    });
    expect(imageRepo.findOneBy).toHaveBeenCalledWith({ userId });
  });
})
// describe('UserService', () => {
//   let userService: UserService;
//   let userRepository: UserRepository;
//   let emailService: EmailService;
//   let rabbitService: RabbitService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: UserRepository,
//           useValue: {
//             save: jest.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
//           },
//         },
//         {
//           provide: EmailService,
//           useValue: {
//             sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
//           },
//         },
//         {
//           provide: RabbitService,
//           useValue: {
//             publishUserCreatedEvent: jest.fn().mockResolvedValue(undefined),
//           },
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//     userRepository = module.get<UserRepository>(UserRepository);
//     emailService = module.get<EmailService>(EmailService);
//     rabbitService = module.get<RabbitService>(RabbitService);
//   });

  
// });
