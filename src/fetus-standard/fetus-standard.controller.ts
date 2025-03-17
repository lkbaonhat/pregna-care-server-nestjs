import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FetusStandardService } from './fetus-standard.service';
import { CreateFetusStandardDto } from './dto/create-fetus-standard.dto';
import { UpdateFetusStandardDto } from './dto/update-fetus-standard.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { Response } from 'src/types/core';

@Controller('admin/fetus-standard')
export class FetusStandardController {
  constructor(private readonly fetusStandardService: FetusStandardService) {}

  @UseGuards(AdminGuard)
  @Get('/find-all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.fetusStandardService.findAll(page, limit);
  }

  @UseGuards(AdminGuard)
  @Get('/find-by-name-week')
  async findFetusStandardByNameAndWeek(
    @Query('name') name: string,
    @Query('minWeek') minWeek: number,
    @Query('maxWeek') maxWeek: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isDeleted') isDeleted: boolean = false,
  ) {
    return this.fetusStandardService.findFetusStandardByNameAndWeek(
      name,
      +minWeek,
      +maxWeek,
      page,
      limit,
      isDeleted,
    );
  }

  @Get('/find-by-week')
  async findByWeekForMember(@Query('week') week: number): Promise<Response> {
    const result = await this.fetusStandardService.findByWeekForMember(+week);
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Get('/search')
  async search(@Query('name') name: string) {
    return this.fetusStandardService.search(name);
  }

  @UseGuards(AdminGuard)
  @Post('/create')
  create(@Body() createFetusStandardDto: CreateFetusStandardDto) {
    return this.fetusStandardService.create(createFetusStandardDto);
  }

  @UseGuards(AdminGuard)
  @Put('/update/id=:id')
  update(
    @Body() updatedFetusStandard: UpdateFetusStandardDto,
    @Param('id') id: string,
  ) {
    return this.fetusStandardService.update(updatedFetusStandard, id);
  }

  @UseGuards(AdminGuard)
  @Delete('/soft-delete/id=:id')
  softDelete(@Param('id') id: string) {
    return this.fetusStandardService.softDelete(id);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/id=:id')
  hardDelete(@Param('id') id: string) {
    return this.fetusStandardService.hardDelete(id);
  }
}
