import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { UUID } from '../utils';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Festivals')
@Controller('api/festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @Post()
  create(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalService.create(createFestivalDto);
  }

  @Get()
  findAll() {
    return this.festivalService.findAll();
  }

  @Get(':id')
  findOne(@UUID('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @Patch(':id')
  update(@UUID('id') id: string, @Body() updateFestivalDto: UpdateFestivalDto) {
    return this.festivalService.update(id, updateFestivalDto);
  }
}
