import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { databaseAccessModule } from '../utils';
import { GameTypeController } from './game-type.controller';
import { GameTypeService } from './game-type.service';

@Module({
  imports: [databaseAccessModule()],
  controllers: [GameController, GameTypeController],
  providers: [GameService, GameTypeService],
})
export class GameModule {}
