import { Controller, Get, Post, Body, Res, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { UsersRoute } from 'src/shared/constants/constants';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(UsersRoute.REGISTER)
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {

   const response = await this.usersService.create(createUserDto);
   res.status(response.responseCode).json(response)
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
