import { Controller, Post, Body, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { FetusStandardService } from './fetus-standard.service';
import { CreateFetusStandardDto } from './dto/create-fetus-standard.dto';
import { Public } from 'src/constants/core';

@Controller('fetus-standard')
export class FetusStandardController {
  constructor(private readonly fetusStandardService: FetusStandardService) { }

  @Get('/weeks-range')
  @Public()
  async weeksRangeActive(@Query('min') min: number, @Query('max') max: number, @Query('isActive') isActive: boolean) {
    return this.fetusStandardService.weeksRangeActive(min, max, isActive);
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
  update(@Body() createFetusStandardDto: CreateFetusStandardDto, @Param('id') id: string) {
    return this.fetusStandardService.update(createFetusStandardDto, id);
  }

  @Delete('/soft-delete/id=:id')
  @Public()
  softDelete(@Param('id') id: string) {
    return this.fetusStandardService.softDelete(id);
  }

  @Delete('/delete/id=:id')
  @Public()
  hardDelete(@Param('id') id: string) {
    return this.fetusStandardService.hardDelete(id);
  }
}
