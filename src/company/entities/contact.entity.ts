import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  phone: string;

  @Column()
  isPrimary: boolean;

  // Foreign keys

  @Column()
  companyId: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Company, (company) => company.contacts)
  company: Company;
}
