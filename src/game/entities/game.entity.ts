import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from 'src/company/entities/company.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
export const UQ_NAME = 'UQ_NAME';

@Entity()
@Unique(UQ_NAME, ['name'])
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: string;

  @Column()
  players: number;

  @Column()
  minAge: number;

  @Column()
  maxAge: number;

  @Column({ default: false })
  isPrototype: boolean;

  // Foreign keys

  @Column()
  publisherId: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Company, (publisher) => publisher.games)
  publisher: Company;
}
