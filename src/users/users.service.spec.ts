import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { MicroserviceService } from 'src/microservice/microservice.service';
import { CreateUserDto } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: UserEntity;
  let rabbitService: MicroserviceService
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    let rabbitService = module.get<MicroserviceService>(MicroserviceService);
  });

  it('should create a user, send an email, and publish an event', async () => {
    expect(service).toBeDefined();
    const createUserDto: CreateUserDto = { email: 'test@example.com', name: 'John Doe', avatar: 'https://random-image.png', job: 'lawyer' };
    const result= await service.create(createUserDto);
    expect(userRepo).toHaveBeenLastCalledWith(createUserDto);
    expect(rabbitService.send).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({ "name": "John Doe", "email": "johndoe@gmail.com", "job": "neurosurgeon", "_id": "664b2eb7cb509c4b09997718" });
  });
  
});

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

//   it('should create a user, send an email, and publish an event', async () => {
//     const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password' };
    
//     const result = await userService.createUser(createUserDto);

//     expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
//     expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com');
//     expect(rabbitService.publishUserCreatedEvent).toHaveBeenCalledWith('1');
//     expect(result).toEqual({ id: '1', email: 'test@example.com' });
//   });
// });
