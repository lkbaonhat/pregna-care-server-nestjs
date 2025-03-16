import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';
import { Response } from 'src/types/core';
import { Request } from 'express';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdateAvatarDto } from './dtos/update-avatar.dto';
import { S3Service } from 'src/s3/s3.service';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(AdminGuard)
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    const result = await this.usersService.findAll(Number(page), Number(limit));
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<Response> {
    const result = await this.usersService.createUserByAdmin(
      body.email,
      body.password,
    );
    return { data: result };
  }

  @Get('self')
  getSelf(@Req() req: Request): Response {
    return { data: req.user };
  }

  @Delete('membership')
  async cancelMembership(@Req() req: Request): Promise<Response> {
    const user = req.user as UserDocument;
    const result = await this.usersService.cancelMembership(user);
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async getUser(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const result = await this.usersService.findById(id);
    return { data: result };
  }

  // TODO: Add User route to update only password
  @Put('password')
  async updatePassword(
    @Req() req: Request,
    @Body() body: UpdatePasswordDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const result = await this.usersService.updatePassword(
      user.id,
      body.oldPassword,
      body.newPassword,
    );
    return { data: result, message: 'Password updated' };
  }

  // TODO: Add User route to upload avatar
  @Put('avatar/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const user = req.user as UserDocument;

    // Upload the file to S3
    const uploadResult = await this.s3Service.uploadFile(file);

    // Update user avatar URL
    const result = await this.usersService.updateAvatar(
      user.id,
      uploadResult.url,
    );

    // If there was a previous avatar and it's different from the new one, delete it
    if (
      result.previousAvatarUrl &&
      result.previousAvatarUrl !== uploadResult.url
    ) {
      try {
        // Extract the key from the previous URL
        const previousKey = result.previousAvatarUrl
          .split('/')
          .slice(3)
          .join('/');

        await this.s3Service.deleteFile(previousKey);
      } catch (error) {
        // Log error but don't fail the request
        console.error('Failed to delete previous avatar:', error);
      }
    }

    return { data: result.user, message: 'Avatar updated successfully' };
  }

  @Put('avatar')
  async updateAvatar(
    @Req() req: Request,
    @Body() body: UpdateAvatarDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;

    if (!body.avatarUrl) {
      throw new BadRequestException('Avatar URL is required');
    }

    const result = await this.usersService.updateAvatar(
      user.id,
      body.avatarUrl,
    );

    return { data: result.user, message: 'Avatar updated successfully' };
  }

  @Delete('avatar')
  async deleteAvatar(@Req() req: Request): Promise<Response> {
    const user = req.user as UserDocument;

    const result = await this.usersService.deleteAvatar(user.id);

    // If there was a previous avatar, delete it from S3
    if (result.previousAvatarUrl) {
      try {
        // Extract the key from the URL
        const key = result.previousAvatarUrl.split('/').slice(3).join('/');

        await this.s3Service.deleteFile(key);
      } catch (error) {
        // Log error but don't fail the request
        console.error('Failed to delete avatar from S3:', error);
      }
    }

    return { data: result.user, message: 'Avatar deleted successfully' };
  }

  // TODO: Add User route to update bloodType, nationality, phoneNumber, firstName, lastName, dateOfBirth
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() body: UpdateProfileDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const result = await this.usersService.updateProfile(user.id, body);
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async updateUser(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: Partial<User>,
  ): Promise<Response> {
    const result = await this.usersService.update(id, body);
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const result = await this.usersService.delete(id);
    return { data: result };
  }
}
