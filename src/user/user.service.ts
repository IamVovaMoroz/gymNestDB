import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { PaginatedData } from '../types/interface';
import { paginate } from '../common';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userDto: UserCreateDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('UserEmail already exists');
    }
    const hashedPassword = await this.hashPassword(userDto.password);
    const user = this.userRepository.create({ ...userDto, password: hashedPassword });
    this.logger.log(`Successfully create user with ID: ${user.id}`);
    return await this.userRepository.save(user);
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return `${salt}:${derivedKey}`;
    } catch (error) {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
  }
  async updateUser(userId: number, updateUserDto: UserUpdateDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    }
    const updatedUser = { ...user, ...updateUserDto };
    return this.userRepository.save(updatedUser);
  }
  async softDeleteUser(id: number): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`Successfully soft-deleted user with ID: ${id}`);
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }
  async findAll(page: number, limit: number): Promise<PaginatedData<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('User');
    return paginate<UserEntity>(queryBuilder, +page, +limit);
  }
  async getUserByField(field: keyof UserEntity, value: string): Promise<UserEntity> {
    const whereClause = { [field]: value };
    const user = await this.userRepository.findOne({ where: whereClause });
    if (!user) {
      throw new NotFoundException(`User with ${field} ${value} is not found`);
    }
    return user;
  }
}
