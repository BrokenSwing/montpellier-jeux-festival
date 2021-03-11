import { Controller, Patch, Post, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'src/utils';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('Contacts')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Patch(':id')
  updateContact(@UUID('id') id: string, updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  deleteContact(@UUID('contactId') contactId: string) {
    return this.contactService.delete(contactId);
  }
}
