import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Contact } from './contact.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Game } from '../../game/entities/game.entity';
export const UQ_COMPANY_NAME = "UQ_COMPANY_NAME";

@Entity()
@Unique(UQ_COMPANY_NAME, ['name'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  isPublisher: boolean;

  @Column()
  isExhibitor: boolean;

  @Column({ default: true })
  isActive: boolean;

  // Relations

  @ApiHideProperty()
  @OneToMany(() => Contact, (contact) => contact.company)
  contacts: Contact[];

  @ApiHideProperty()
  @OneToMany(() => Game, (game) => game.publisher)
  games: Game[];
}
