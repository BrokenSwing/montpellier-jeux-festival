import {
  Controller,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UUIDPipe } from '../utils';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiBearerAuth()
@ApiTags('Contacts')
@UseGuards(JwtAuthGuard)
@Controller('api/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Patch(':id')
  updateContact(
    @Param('id', UUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  deleteContact(@Param('id', UUIDPipe) contactId: string) {
    return this.contactService.delete(contactId);
  }
}
