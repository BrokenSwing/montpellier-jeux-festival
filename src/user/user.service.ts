import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields, isConstraint } from '../utils';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UQ_USERNAME, User } from './entities/user.entity';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Creates new user.
   *
   * @param createUserDto The data for the user
   * @returns the created user
   */
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await this.passwordService.hashPassword(
        createUserDto.password,
      );
      const { password, ...result } = await this.userRepository.save(
        createUserDto,
      );
      return result;
    } catch (e) {
      if (isConstraint(e, UQ_USERNAME)) {
        throw new BadRequestException('The given username is already used');
      }
      this.logger.error(e);
      throw new InternalServerErrorException('Unable to create the given user');
    }
  }

  /**
   * @returns all users
   */
  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  /**
   * Retrieves the user with the given id.
   *
   * @param id The id of the user to retrieve
   * @returns the user with the given id
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new NotFoundException(`No user with UUID ${id} can be found`);
    }
  }

  /**
   * Retrieves the user with the given username.
   *
   * @param username The username of the user to retrieve
   * @returns the user with the given username
   */
  findByUsername(username: string) {
    const user = this.userRepository.find({
      where: {
        username,
      },
    });
    if (user) {
      return user;
    } else {
      throw new NotFoundException(
        `No user with username ${username} can be found`,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (hasNoFields(updateUserDto)) {
      throw new BadRequestException('You must specify fields to update');
    }

    let result: UpdateResult;

    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
    }
    try {
      result = await this.userRepository.update(id, updateUserDto);
    } catch (e) {
      if (isConstraint(e, UQ_USERNAME)) {
        throw new BadRequestException('The given username is already used.');
      }
      this.logger.error(e);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.findOne(id);
  }

  /**
   * Delete the user with the given id.
   *
   * @param id The id of the user to delete
   * @returns the result of deleting
   */
  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
