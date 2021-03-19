import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields, isConstraint } from '../utils';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindCompanyDto } from './dto/find-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, UQ_COMPANY_NAME } from './entities/company.entity';

/**
 * This service is responsible to manage companies.
 */
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  /**
   * Creates a company.
   *
   * @param createCompanyDto The data to create the company
   * @returns the create company
   */
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      return await this.companyRepository.save(createCompanyDto);
    } catch (e) {
      if (isConstraint(e, UQ_COMPANY_NAME)) {
        throw new BadRequestException('The given company name is already used');
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find all the companies matching the filter.
   *
   * @param findCompanyDto The filter
   * @returns the companies matching the filter
   */
  findAll(findCompanyDto: FindCompanyDto) {
    if (hasNoFields(findCompanyDto)) {
      return this.companyRepository.find({ where: { isActive: true } });
    } else {
      if (findCompanyDto.publisher && findCompanyDto.exhibitor) {
        return this.companyRepository.find({
          where: {
            isPublisher: findCompanyDto.publisher,
            isExhibitor: findCompanyDto.exhibitor,
            isActive: findCompanyDto.active ? findCompanyDto.active : true,
          },
        });
      } else {
        if (findCompanyDto.publisher) {
          return this.companyRepository.find({
            where: {
              isPublisher: findCompanyDto.publisher,
              isActive: findCompanyDto.active ? findCompanyDto.active : true,
            },
          });
        } else {
          return this.companyRepository.find({
            where: {
              isExhibitor: findCompanyDto.exhibitor,
              isActive: findCompanyDto.active ? findCompanyDto.active : true,
            },
          });
        }
      }
    }
  }

  /**
   * Retrieves the company with the given id.
   * If no company was found, it throws a NotFoundException.
   *
   * @param id The id of the company to retrieve
   * @returns the company with the given id
   */
  async findOne(id: string) {
    const company = await this.companyRepository.findOne(id, {
      relations: ['contacts'],
    });
    if (company) {
      return company;
    }
    throw new NotFoundException();
  }

  /**
   * Updates the company with the given, and sets the given values
   * to it.
   * It throws a NotFoundException if company can't be found.
   * It throws a BadRequestException if no data is provided in `updateCompanyDto`
   *
   * @param id The id of the company to update
   * @param updateCompanyDto The data to update the company
   * @returns the updated company
   */
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    if (hasNoFields(updateCompanyDto)) {
      throw new BadRequestException('You must specify at least one field');
    }
    const result = await this.companyRepository.update(id, updateCompanyDto);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(id);
  }

  /**
   * Deletes the company with the given id.
   * It throws a NotFoundException if the commpany can't be found.
   *
   * @param id The id of the company to delete
   * @returns an object indicating the company was deleted
   */
  async delete(id: string) {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
