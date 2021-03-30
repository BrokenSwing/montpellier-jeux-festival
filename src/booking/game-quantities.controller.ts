import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UUIDPipe } from '../utils';
import { CreateGameQuantitiesDto } from './dto/create-game-quantities.dto';
import { GameQuantitiesService } from './game-quantities.service';

@ApiBearerAuth()
@ApiTags('Game quantities')
@UseGuards(JwtAuthGuard)
@Controller('api/game-quantities')
export class GameQuantitiesController {
  constructor(private gameQuantitiesService: GameQuantitiesService) {}

  @Post()
  create(@Body() createGameQuantitiesDto: CreateGameQuantitiesDto) {
    return this.gameQuantitiesService.create(createGameQuantitiesDto);
  }
}
