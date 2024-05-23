import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorResponse } from 'src/shared/constants/responses/error';
import axios from 'axios';
import { SuccessResponse } from 'src/shared/constants/responses/success';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { ImageEntity } from './entities/image.entity';
import { sendEmail } from 'src/shared/constants/email';
/* eslint-disable no-unused-vars */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, avatar, job } = createUserDto;
      const user = await this.userRepo.findOneBy({ email });
      if (user) {
        return ErrorResponse(404, 'Oops! user already exists', null, null);
      }
      const userEnt = await this.userRepo.save({ name, email, avatar, job });

      sendEmail(userEnt.email);
      return SuccessResponse(201, 'user creation successful!', userEnt, null);
    } catch (error) {
      return ErrorResponse(400, 'unable to create user', null, null);
    }
  }

  async findOne(userId: number) {
    try {
      const user = await axios.get(`https://reqres.in/api/users/${userId}`);
      return SuccessResponse(200, `user now retrieved..`, user.data.data, null);
    } catch (error) {
      return ErrorResponse(400, 'unable to retrieve user', null, null);
    }
  }

  async retrieveImageFile(userId: string) {
    try {
      const image = await this.imageRepo.findOneBy({ userId });
      if (image) {
        const imageBuffer = fs.readFileSync(image.filePath);
        return SuccessResponse(
          200,
          'encoded image successfully retrieved...',
          { image: imageBuffer.toString('base64') },
          null,
        );
      }
      const avatarUrl = `https://reqres.in/api/users/${userId}`;
      const response = await axios.get(avatarUrl);
      const fileBuffer = Buffer.from(response.data.data.avatar, 'binary');
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      const uploadsDir = path.join(__dirname, 'uploads');
      const filePath = path.join(uploadsDir, `${hash}.png`);
      await this.imageRepo.save({ userId, hash, filePath });
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.writeFileSync(filePath, fileBuffer);
      return SuccessResponse(
        201,
        'base64 encoded-string now retrieved...',
        { image: fileBuffer.toString('base64') },
        null,
      );
    } catch (error) {
      return ErrorResponse(400, 'unable to retrieve encoded image', null, null);
    }
  }

  async remove(userId: string) {
    try {
      const image = await this.imageRepo.findOneBy({ userId });
      if (image) {
        return SuccessResponse(404, 'user avatar not found...', null, null);
      }
      fs.unlinkSync(image.filePath);
      await this.imageRepo.delete({ userId });
      return SuccessResponse(200, 'user deleted successfully', null, null);
    } catch (error) {
      return ErrorResponse(400, null, null, null);
    }
  }
}
