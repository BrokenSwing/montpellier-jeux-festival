import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from './contact.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Game } from '../../game/entities/game.entity';

@Entity()
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
