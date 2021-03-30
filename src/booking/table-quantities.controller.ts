import {
  Body,
  Controller,
  Delete,
  Get,
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

  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.tableQuantitiesService.findOne(id);
  }

  @Post()
  create(@Body() createTableQuantitiesDto: CreateTableQuantitiesDto) {
    return this.tableQuantitiesService.create(createTableQuantitiesDto);
  }

  @Patch(':id')
  update(
    @Param('id', UUIDPipe) id: string,
    updateTableQuantitiesDto: UpdateTableQuantitiesDto,
  ) {
    return this.tableQuantitiesService.update(id, updateTableQuantitiesDto);
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.tableQuantitiesService.delete(id);
  }
}
