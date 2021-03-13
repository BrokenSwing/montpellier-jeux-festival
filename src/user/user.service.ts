import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isConstraint } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UQ_NAME, User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates new user.
   *
   * @param createUserDto The data for the user
   * @returns the created user
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...result } = await this.userRepository.save(
        createUserDto,
      );
      return result;
    } catch (e) {
      if (isConstraint(e, UQ_NAME)) {
        throw new BadRequestException('The given username is already used');
      }
      this.logger.error(e);
      throw new InternalServerErrorException('Unable to create the given user');
    }
  }

  /**
   * @returns all users
   */
  findAll() {
    return this.userRepository.find();
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * Delete the user with the given id.
   *
   * @param id The id of the user to delete
   * @returns the result of deleting
   */
  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
