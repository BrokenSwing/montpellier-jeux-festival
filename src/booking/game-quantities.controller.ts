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
import { CreateGameQuantitiesDto } from './dto/create-game-quantities.dto';
import { UpdateGameQuantitiesDto } from './dto/update-game-quantities.dto';
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

  @Patch(':bookingId/:gameId')
  update(
    @Param('bookingId', UUIDPipe) bookingId: string,
    @Param('gameId', UUIDPipe) gameId: string,
    @Body() updateGameQuantitiesDto: UpdateGameQuantitiesDto,
  ) {
    return this.gameQuantitiesService.update(
      bookingId,
      gameId,
      updateGameQuantitiesDto,
    );
  }

  @Delete(':bookingId/:gameId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('bookingId', UUIDPipe) bookingId: string,
    @Param('gameId', UUIDPipe) gameId: string,
  ) {
    return this.gameQuantitiesService.delete(bookingId, gameId);
  }
}
