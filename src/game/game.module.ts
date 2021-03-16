import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { databaseAccessModule } from '../utils';

@Module({
  imports: [databaseAccessModule()],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
