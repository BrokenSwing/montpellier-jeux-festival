import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields } from '../utils';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

/**
 * This service is responsible for managing contacts of a company.
 */
@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
  ) {}

  /**
   * Create a contact for a company.
   *
   * @param createContactDto The data to create the contact
   * @returns the created contact
   */
  create(createContactDto: CreateContactDto) {
    const { companyId, ...dto } = createContactDto;
    return this.contactRepository.save({
      ...dto,
      companyId: companyId,
    });
  }

  /**
   * Finds the contact with the given id.
   *
   * @param contactId The id of the contact
   * @returns the requested contact
   */
  async findOne(contactId: string) {
    const contact = await this.contactRepository.findOne(contactId);

    if (contact) {
      return contact;
    }
    throw new NotFoundException();
  }

  /**
   * Updates the contact with the given id,
   * updating it's fields with the given data.
   *
   * @param contactId The id of the contact to update
   * @param updateContactDto The data to update the contact
   * @return the updated contact
   */
  update(contactId: string, updateContactDto: UpdateContactDto) {
    if (hasNoFields(updateContactDto)) {
      throw new BadRequestException('You must specify at least one field');
    }
    return this.contactRepository.save({
      id: contactId,
      ...updateContactDto,
    });
  }

  /**
   * Deletes the contact with the given id.
   *
   * @param contactId The id of the contact
   * @returns an object indicating the deletation was successful
   */
  async delete(contactId: string) {
    const result = await this.contactRepository.delete(contactId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
