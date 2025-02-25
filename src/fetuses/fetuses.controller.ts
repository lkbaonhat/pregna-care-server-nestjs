import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FetusesService } from './fetuses.service';
import { CreateFetusDto } from './dto/create-fetus.dto';
import { UpdateFetusDto } from './dto/update-fetus.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserDocument } from 'src/users/user.schema';
import { CreateUserFetusDto } from './dto/create-user-fetus.dto';
import { Request } from 'express';
import { Response } from 'src/types/core';
import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';

@Controller('fetuses')
export class FetusesController {
  constructor(private readonly fetusesService: FetusesService) {}

  @UseGuards(AdminGuard)
  @Post('/create')
  async create(@Body() createFetusDto: CreateFetusDto): Promise<Response> {
    const createdFetus = await this.fetusesService.create(createFetusDto);

    return {
      message: 'Created successfully',
      data: createdFetus,
    };
  }

  @UseGuards(AdminGuard)
  @Get('/find-all')
  async findAll(): Promise<Response> {
    const result = await this.fetusesService.findAll();

    return {
      data: result,
    };
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const result = await this.fetusesService.findOne(id);

    return {
      data: result,
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFetusDto: UpdateFetusDto,
  ): Promise<Response> {
    const updatedFetus = await this.fetusesService.update(id, updateFetusDto);

    return {
      message: 'Updated successfully',
      data: updatedFetus,
    };
  }

  @UseGuards(AdminGuard)
  @Delete('/soft-delete/:id')
  async softDelete(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const deletedFetus = await this.fetusesService.softDelete(id);

    return {
      message: 'Soft Deleted successfully',
      data: deletedFetus,
    };
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/:id')
  async hardDelete(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const deletedFetus = await this.fetusesService.hardDelete(id);

    return {
      message: 'Hard Deleted successfully',
      data: deletedFetus,
    };
  }

  @Post('users/create')
  async createByUser(
    @Req() req: Request,
    @Body() createFetusDto: CreateUserFetusDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const createUser = await this.fetusesService.createByUser(
      user,
      createFetusDto,
    );

    return {
      message: 'Created successfully',
      data: createUser,
    };
  }

  @Put('users/:id')
  async updateByUser(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFetusDto: UpdateFetusDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const updatedFetus = await this.fetusesService.updateByUser(
      user,
      id,
      updateFetusDto,
    );

    return {
      message: 'Updated successfully',
      data: updatedFetus,
    };
  }

  @Delete('users/soft-delete/:id')
  async softDeleteByUser(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const deletedFetus = await this.fetusesService.softDeleteByUser(user, id);

    return {
      message: 'Soft Deleted successfully',
      data: deletedFetus,
    };
  }

  @Delete('users/delete/:id')
  async hardDeleteByUser(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const deletedFetus = await this.fetusesService.hardDeleteByUser(user, id);

    return {
      message: 'Hard Deleted successfully',
      data: deletedFetus,
    };
  }
}
