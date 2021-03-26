import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';
import { Festival } from '../../festival/entities/festival.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameQuantities } from './game-quantities.entity';
import { TableQuantities } from './table-quantities.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  notes: string;

  @Column({
    type: 'text',
    default: '',
  })
  exchanges: string;

  @Column()
  needVolunteers: boolean;

  @Column()
  isPresent: boolean;

  @Column()
  isPlaced: boolean;

  @Column('float')
  discount: number;

  @Column('float')
  fees: number;

  @Column()
  createdOn: Date;

  @Column({ nullable: true })
  billSentOn: Date;

  @Column({ nullable: true })
  billPaidOn: Date;

  // Foreign keys

  @Column()
  festivalId: string;

  @Column()
  companyId: string;

  // Relations

  @ApiHideProperty()
  @OneToMany(() => TableQuantities, (quantities) => quantities.booking)
  tablesQuantities: TableQuantities[];

  @ApiHideProperty()
  @OneToMany(() => GameQuantities, (quantities) => quantities.booking)
  gamesQuantities: GameQuantities[];

  @ApiHideProperty()
  @ManyToOne(() => Festival)
  festival: Festival;

  @ApiHideProperty()
  @ManyToOne(() => Company)
  company: Company;
}
