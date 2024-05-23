import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ImageEntity } from './entities/image.entity';
import { MicroserviceService } from 'src/microservice/microservice.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ImageEntity])],
  controllers: [UsersController],
  providers: [UsersService, MicroserviceService],
})
export class UsersModule {}
