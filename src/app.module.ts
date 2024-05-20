import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { config } from 'dotenv';
config()

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot({type: 'mongodb', url: process.env.DB_URL, useNewUrlParser: true, useUnifiedTopology: true, synchronize: true, autoLoadEntities: true}), TypeOrmModule.forFeature([UserEntity])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
