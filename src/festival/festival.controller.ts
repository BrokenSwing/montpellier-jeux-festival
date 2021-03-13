import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { UUIDPipe } from '../utils';
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
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.festivalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', UUIDPipe) id: string, @Body() updateFestivalDto: UpdateFestivalDto) {
    return this.festivalService.update(id, updateFestivalDto);
  }
}
