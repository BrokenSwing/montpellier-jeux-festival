import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { UUIDPipe } from '../utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Festivals')
@Controller('api/festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  /**
   * Allows to list all available festivals.
   */
  @Get()
  findAll() {
    return this.festivalService.findAll();
  }

  /**
   * Allows to create new festival. If `isActive` is set to `true`,
   * any other festival will become inactive.
   * As a consequence, visitors will be able to access this new festival
   * data (exhibited games, editors, etc ...).
   */
  @Post()
  create(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalService.create(createFestivalDto);
  }

  /**
   * Allows to retrieve data for a specific festival.
   */
  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.festivalService.findOne(id);
  }

  /**
   * Allows to update a specific festival. You **MUST** provide
   * at least one field to update.
   *
   * If you update a festival making it active, then any other festival
   * will become inactive (if previously active).
   *
   * If you update a festival to be inactive and this festival was active,
   * then no festival will be active.
   */
  @Patch(':id')
  update(
    @Param('id', UUIDPipe) id: string,
    @Body() updateFestivalDto: UpdateFestivalDto,
  ) {
    return this.festivalService.update(id, updateFestivalDto);
  }
}
