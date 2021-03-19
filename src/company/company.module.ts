import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { databaseAccessModule } from '../utils';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [databaseAccessModule()],
  controllers: [CompanyController, ContactController],
  providers: [CompanyService, ContactService],
})
export class CompanyModule {}
