import { ApiHideProperty } from '@nestjs/swagger';
import { Area } from '../../festival/entities/area.entity';
import { Game } from '../../game/entities/game.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class GameQuantities {
  @Column('int')
  exhibited: number;

  @Column('int')
  donation: number;

  @Column('int')
  raffle: number;

  @Column({ nullable: true })
  receivedOn: Date;

  @Column({ nullable: true })
  returnedOn: Date;

  @Column()
  needsReturn: boolean;

  @Column('float')
  tablesCount: number;

  // Foreign keys

  @Column({ primary: true })
  bookingId: string;

  @Column({ nullable: true })
  areaId: string;

  @Column({ primary: true })
  gameId: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Booking, (booking) => booking.gamesQuantities, {
    primary: true,
  })
  booking: string;

  @ApiHideProperty()
  @ManyToOne(() => Area, { nullable: true })
  area: Area;

  @ApiHideProperty()
  @ManyToOne(() => Game, (game) => game.gamesQuantities, {
    primary: true,
  })
  game: Game;
}
