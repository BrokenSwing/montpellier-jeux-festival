import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDPipe } from 'src/utils';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@ApiBearerAuth()
@ApiTags('Areas')
@Controller('api/area')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @Patch(':id')
  update(@Param('id', UUIDPipe) id: string, updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.areaService.delete(id);
  }
}
