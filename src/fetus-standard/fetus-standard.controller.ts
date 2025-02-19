import { Controller, Post, Body, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { FetusStandardService } from './fetus-standard.service';
import { CreateFetusStandardDto } from './dto/create-fetus-standard.dto';
import { Public } from 'src/constants/core';

@Controller('fetus-standard')
export class FetusStandardController {
  constructor(private readonly fetusStandardService: FetusStandardService) { }

  @Get('/find-all')
  async findAll() {
    return this.fetusStandardService.findAll();
  }

  @Get('/find-by-name')
  async findFetusStandardByName(@Query('name') name: string, @Query('isActive') isActive: boolean) {
    return this.fetusStandardService.findFetusStandardByName(name, isActive);
  }

  @Get('/search')
  async search(@Query('name') name: string) {
    return this.fetusStandardService.search(name);
  }

  @Post('/create')
  create(@Body() createFetusStandardDto: CreateFetusStandardDto) {
    return this.fetusStandardService.create(createFetusStandardDto);
  }

  @Put('/update/id=:id')
  update(@Body() createFetusStandardDto: CreateFetusStandardDto, @Param('id') id: string) {
    return this.fetusStandardService.update(createFetusStandardDto, id);
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
