import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { databaseAccessModule } from '../utils';
import { ContactService } from './contact.service';

@Module({
  imports: [databaseAccessModule()],
  controllers: [CompanyController],
  providers: [CompanyService, ContactService],
})
export class CompanyModule {}
