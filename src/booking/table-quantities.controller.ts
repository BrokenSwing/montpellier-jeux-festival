import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDPipe } from 'src/utils';
import { CreateTableQuantitiesDto } from './dto/create-table-quantities.dto';
import { UpdateTableQuantitiesDto } from './dto/update-table-quantities.dto';
import { TableQuantitiesService } from './table-quantities.service';

@ApiBearerAuth()
@ApiTags('Table quantities')
@Controller('api/table-quantities')
export class TableQuantitiesController {
  constructor(private tableQuantitiesService: TableQuantitiesService) {}

  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.tableQuantitiesService.findOne(id);
  }

  @Post()
  create(createTableQuantitiesDto: CreateTableQuantitiesDto) {
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
