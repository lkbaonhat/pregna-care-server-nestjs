import { Controller, Post, Body, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { FetusStandardService } from './fetus-standard.service';
import { CreateFetusStandardDto } from './dto/create-fetus-standard.dto';
import { Public } from 'src/constants/core';
import { Pagination } from './dto/pagination';
import { UpdateFetusStandardDto } from './dto/update-fetus-standard.dto';

@Controller('fetus-standard')
export class FetusStandardController {
  constructor(private readonly fetusStandardService: FetusStandardService) { }

  @Get('/find-all')
  @Public()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.fetusStandardService.findAll(page, limit);
  }

  @Get('/find-by-name-week')
  @Public()
  async findFetusStandardByNameAndWeek(
    @Query('name') name: string,
    @Query('minWeek') minWeek: number,
    @Query('maxWeek') maxWeek: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.fetusStandardService.findFetusStandardByNameAndWeek(name, +minWeek, +maxWeek, page, limit);
  }

  @Get('/search')
  @Public()
  async search(@Query('name') name: string) {
    return this.fetusStandardService.search(name);
  }

  @Post('/create')
  @Public()
  create(@Body() createFetusStandardDto: CreateFetusStandardDto) {
    return this.fetusStandardService.create(createFetusStandardDto);
  }

  @Put('/update/id=:id')
  @Public()
  update(@Body() updatedFetusStandard: UpdateFetusStandardDto, @Param('id') id: string) {
    return this.fetusStandardService.update(updatedFetusStandard, id);
  }

  @Delete('/soft-delete/id=:id')
  softDelete(@Param('id') id: string) {
    return this.fetusStandardService.softDelete(id);
  }

  @Delete('/delete/id=:id')
  hardDelete(@Param('id') id: string) {
    return this.fetusStandardService.hardDelete(id);
  }
}
