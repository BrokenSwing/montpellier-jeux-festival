import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { UUID } from '../utils';

@Controller('api/festival')
export class FestivalController {
  constructor(
    private readonly festivalService: FestivalService,
    private readonly priceService: PriceService,
  ) {}

  // Festivals

  @Post()
  createFestival(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalService.create(createFestivalDto);
  }

  @Get()
  findAllFestivals() {
    return this.festivalService.findAll();
  }

  @Get(':id')
  findOneFestival(@UUID('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @Patch(':id')
  updateFestival(
    @UUID('id') id: string,
    @Body() updateFestivalDto: UpdateFestivalDto,
  ) {
    return this.festivalService.update(id, updateFestivalDto);
  }

  // Prices

  @Get(':id/prices')
  findAllPricesForFestival(@UUID('id') id: string) {
    return this.priceService.findByFestival(id);
  }

  @Post(':id/prices')
  createPriceForFestival(
    @UUID('id') id: string,
    @Body() createPriceDto: CreatePriceDto,
  ) {
    return this.priceService.create(id, createPriceDto);
  }

  @Patch(':festivalId/prices/:priceId')
  updatePrice(
    @UUID('festivalId') festivalId: string,
    @UUID('priceId') priceId: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return this.priceService.update(festivalId, priceId, updatePriceDto);
  }

  @Delete(':festivalId/prices/:priceId')
  deletePrice(
    @UUID('festivalId') festivalId: string,
    @UUID('priceId') priceId: string,
  ) {
    return this.priceService.delete(festivalId, priceId);
  }
}
