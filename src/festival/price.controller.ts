import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UUIDPipe } from '../utils';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PriceService } from './price.service';

@ApiBearerAuth()
@ApiTags('Prices')
@UseGuards(JwtAuthGuard)
@Controller('api/price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Patch(':id')
  updatePrice(
    @Param('id', UUIDPipe) priceId: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return this.priceService.update(priceId, updatePriceDto);
  }

  @Post()
  createPriceForFestival(@Body() createPriceDto: CreatePriceDto) {
    return this.priceService.create(createPriceDto);
  }

  @Delete(':id')
  deletePrice(@Param('id', UUIDPipe) priceId: string) {
    return this.priceService.delete(priceId);
  }
}
