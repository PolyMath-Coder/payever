import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorResponse } from 'src/shared/constants/responses/error';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, avatar, job } = createUserDto
    const user = await this.userRepo.findOneBy({ email })
    if(user) {
      return ErrorResponse(404, 'Oops! user already exists', null, null)
    }

    const userEnt = await this.userRepo.save({ name, email, avatar, job })

    console.log(userEnt)
    return ErrorResponse(201, 'user creation successful!', userEnt, null)
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
