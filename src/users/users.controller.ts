import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { UsersRoute } from 'src/shared/constants/constants';
import { MicroserviceService } from 'src/microservice/microservice.service';
/* eslint-disable no-unused-vars */
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService, 
    private readonly rabbitService: MicroserviceService
  ) {}

  @Post(UsersRoute.REGISTER)
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const response = await this.usersService.create(createUserDto);
    await this.rabbitService.send(response.message, response.data);
    res.status(response.responseCode).json(response);
  }

  @Get(UsersRoute.SINGLE_USER)
  async getUser(@Param('userId') userId: string, @Res() res) {
    const response = await this.usersService.findOne(+userId);
    res.status(response.responseCode).json(response);
  }

  @Get('/user/:userId/avatar')
  async retrieveImage(@Param('userId') userId: string, @Res() res) {
    const response = await this.usersService.retrieveImageFile(userId);
    res.status(response.responseCode).json(response);
  }

  @Delete('/user/:userId/avatar')
  async remove(@Param('userId') userId: string) {
    return await this.usersService.remove(userId);
  }
}
