import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UUIDPipe } from '../utils';
import { CreateTableQuantitiesDto } from './dto/create-table-quantities.dto';
import { UpdateTableQuantitiesDto } from './dto/update-table-quantities.dto';
import { TableQuantitiesService } from './table-quantities.service';

@ApiBearerAuth()
@ApiTags('Table quantities')
@UseGuards(JwtAuthGuard)
@Controller('api/table-quantities')
export class TableQuantitiesController {
  constructor(private tableQuantitiesService: TableQuantitiesService) {}

  @Post()
  create(@Body() createTableQuantitiesDto: CreateTableQuantitiesDto) {
    return this.tableQuantitiesService.create(createTableQuantitiesDto);
  }

  @Patch(':bookingId/:priceId')
  update(
    @Param('bookingId', UUIDPipe) bookingId: string,
    @Param('priceId', UUIDPipe) priceId: string,
    @Body() updateTableQuantitiesDto: UpdateTableQuantitiesDto,
  ) {
    return this.tableQuantitiesService.update(
      bookingId,
      priceId,
      updateTableQuantitiesDto,
    );
  }

  @Delete(':bookingId/:priceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('bookingId', UUIDPipe) bookingId: string,
    @Param('priceId', UUIDPipe) priceId: string,
  ) {
    return this.tableQuantitiesService.delete(bookingId, priceId);
  }
}
