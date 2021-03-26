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
import { CreateGameQuantitiesDto } from './dto/create-game-quantities.dto';
import { UpdateGameQuantitiesDto } from './dto/update-game-quantities.dto';
import { GameQuantitiesService } from './game-quantities.service';

@ApiBearerAuth()
@ApiTags('Game quantities')
@UseGuards(JwtAuthGuard)
@Controller('api/game-quantities')
export class GameQuantitiesController {
  constructor(private gameQuantitiesService: GameQuantitiesService) {}

  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.gameQuantitiesService.findOne(id);
  }

  @Post()
  create(@Body() createGameQuantitiesDto: CreateGameQuantitiesDto) {
    return this.gameQuantitiesService.create(createGameQuantitiesDto);
  }

  @Patch(':id')
  update(
    @Param('id', UUIDPipe) id: string,
    @Body() updateGameQuantitiesDto: UpdateGameQuantitiesDto,
  ) {
    return this.gameQuantitiesService.update(id, updateGameQuantitiesDto);
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.gameQuantitiesService.delete(id);
  }
}
