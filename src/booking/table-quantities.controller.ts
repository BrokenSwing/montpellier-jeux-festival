import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'src/utils';
import { CreateTableQuantitiesDto } from './dto/create-table-quantities.dto';
import { UpdateTableQuantitiesDto } from './dto/update-table-quantities.dto';
import { TableQuantitiesService } from './table-quantities.service';

@ApiTags('Table quantities')
@Controller('api/table-quantities')
export class TableQuantitiesController {
  constructor(private tableQuantitiesService: TableQuantitiesService) {}

  @Get(':id')
  findOne(@UUID('id') id: string) {
    return this.tableQuantitiesService.findOne(id);
  }

  @Post()
  create(createTableQuantitiesDto: CreateTableQuantitiesDto) {
    return this.tableQuantitiesService.create(createTableQuantitiesDto);
  }

  @Patch(':id')
  update(
    @UUID('id') id: string,
    updateTableQuantitiesDto: UpdateTableQuantitiesDto,
  ) {
    return this.tableQuantitiesService.update(id, updateTableQuantitiesDto);
  }

  @Delete(':id')
  delete(@UUID('id') id: string) {
    return this.tableQuantitiesService.delete(id);
  }
}
