import { Area } from 'src/festival/entities/area.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ primary: true })
  areaId: string;

  // Relations

  @ManyToOne(() => Booking, (booking) => booking.gameQuantities, {
    primary: true,
  })
  booking: string;

  @ManyToOne(() => Area, { primary: true })
  area: Area;
}
