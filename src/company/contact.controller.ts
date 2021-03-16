import { Controller, Patch, Post, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDPipe } from '../utils';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiBearerAuth()
@ApiTags('Contacts')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Patch(':id')
  updateContact(
    @Param('id', UUIDPipe) id: string,
    updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  deleteContact(@Param('contactId', UUIDPipe) contactId: string) {
    return this.contactService.delete(contactId);
  }
}
