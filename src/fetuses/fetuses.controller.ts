import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { FetusesService } from './fetuses.service';
import { CreateFetusDto } from './dto/create-fetus.dto';
import { UpdateFetusDto } from './dto/update-fetus.dto';

@Controller('fetuses')
export class FetusesController {
  constructor(private readonly fetusesService: FetusesService) { }

  @Post('/create')
  create(@Body() createFetusDto: CreateFetusDto) {
    return this.fetusesService.create(createFetusDto);
  }

  @Get('/find-all')
  async findAll() {
    return await this.fetusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fetusesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFetusDto: UpdateFetusDto) {
    return this.fetusesService.update(id, updateFetusDto);
  }

  @Delete('/soft-delete/:id')
  softDelete(@Param('id') id: string) {
    return this.fetusesService.softDelete(id);
  }

  @Delete('/delete/:id')
  hardDelete(@Param('id') id: string) {
    return this.fetusesService.hardDelete(id);
  }
}
