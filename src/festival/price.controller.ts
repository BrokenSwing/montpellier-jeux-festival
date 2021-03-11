import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'src/utils';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PriceService } from './price.service';

@ApiTags('Prices')
@Controller('api/price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Patch(':id')
  updatePrice(
    @UUID('id') priceId: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return this.priceService.update(priceId, updatePriceDto);
  }

  @Post()
  createPriceForFestival(@Body() createPriceDto: CreatePriceDto) {
    return this.priceService.create(createPriceDto);
  }

  @Delete(':id')
  deletePrice(@UUID('id') priceId: string) {
    return this.priceService.delete(priceId);
  }
}
