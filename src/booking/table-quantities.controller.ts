import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTableQuantitiesDto } from './dto/create-table-quantities.dto';
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
}
