import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UUID } from 'src/utils';
import { CompanyService } from './company.service';
import { ContactService } from './contact.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindCompanyDto } from './dto/find-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('api/company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly contactService: ContactService,
  ) {}

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAllCompanies(@Param() findCompanyDto: FindCompanyDto) {
    return this.companyService.findAll(findCompanyDto);
  }

  @Get(':id')
  findOneCompany(@UUID('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  updateCompany(
    @UUID('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  deleteCompany(@UUID('id') id: string) {
    return this.companyService.delete(id);
  }

  // Contacts

  @Get(':id/contact')
  findAllContactsForCompany(@UUID('id') id: string) {
    return this.contactService.findAllForCompany(id);
  }

  @Post(':id/contact')
  createContact(
    @UUID('id') id: string,
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.contactService.create(id, createContactDto);
  }

  @Patch(':companyId/contact/:contactId')
  updateContact(
    @UUID('companyId') companyId: string,
    @UUID('contactId') contactId: string,
    updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(companyId, contactId, updateContactDto);
  }

  @Delete(':companyId/contact/:contactId')
  deleteContact(
    @UUID('companyId') companyId: string,
    @UUID('contactId') contactId: string,
  ) {
    return this.contactService.delete(companyId, contactId);
  }
}
