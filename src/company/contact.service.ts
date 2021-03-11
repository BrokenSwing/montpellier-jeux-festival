import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields } from 'src/utils';
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
   * @param companyId The id to create the contact for
   * @param createContactDto The data to create the contact
   * @returns the created contact
   */
  create(companyId: string, createContactDto: CreateContactDto) {
    return this.contactRepository.create({
      ...createContactDto,
      companyId,
    });
  }

  /**
   * Finds the contact with the given id that belongs to the company
   * with the given id.
   *
   * @param companyId The id of the company the contact belongs to
   * @param contactId The id of the contact
   * @returns the requested contact
   */
  async findOne(companyId: string, contactId: string) {
    const contact = await this.contactRepository.findOne(contactId, {
      where: {
        companyId,
      },
    });

    if (contact) {
      return contact;
    }
    throw new NotFoundException();
  }

  /**
   * Retrieves all the contacts for a given company.
   *
   * @param companyId The id of the company to find contacts of
   * @returns the contacts of the company with the given id
   */
  async findAllForCompany(companyId: string) {
    return this.contactRepository.find({
      where: {
        companyId,
      },
    });
  }

  /**
   * Updates the contact with the given id, from the company with the given id,
   * updating it's fields with the given data.
   *
   * @param companyId The id of the company the contact belongs to
   * @param contactId The id of the contact to update
   * @param updateContactDto The data to update the contact
   * @return the updated contact
   */
  async update(
    companyId: string,
    contactId: string,
    updateContactDto: UpdateContactDto,
  ) {
    if (hasNoFields(updateContactDto)) {
      throw new BadRequestException('You must specify at least one field');
    }
    const result = await this.contactRepository.update(
      {
        id: contactId,
        companyId,
      },
      updateContactDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(companyId, contactId);
  }

  /**
   * Deletes the contact with the given id.
   *
   * @param companyId The id of the company the contact belongs to
   * @param contactId The id of the contact
   * @returns an object indicating the deletation was successful
   */
  async delete(companyId: string, contactId: string) {
    const result = await this.contactRepository.delete({
      id: contactId,
      companyId,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
