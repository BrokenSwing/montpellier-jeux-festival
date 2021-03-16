import { ApiHideProperty } from '@nestjs/swagger';
import { Price } from '../../festival/entities/prices.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class TableQuantities {
  @Column('float')
  tables: number;

  @Column('float')
  floors: number;

  // Foreign keys

  @Column({ primary: true })
  priceId: string;

  @Column({ primary: true })
  bookingId: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Booking, (booking) => booking.tablesQuantities, {
    primary: true,
  })
  booking: Booking;

  @ApiHideProperty()
  @ManyToOne(() => Price, { primary: true })
  price: Price;
}
