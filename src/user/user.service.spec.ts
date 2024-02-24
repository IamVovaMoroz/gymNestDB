import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MockExpectedResultOfUser, MockHashedPassword, mockUpdateUserDto, MokUserDto } from '../common/constants';
import { UserUpdateDto } from './dto/user.update.dto';

const mockField = 'email';
const mockValue = 'test@example.com';
const mockUser = { id: 1, email: 'test@example.com' };
const mockPage = 1;
const mockLimit = 10;
const userId = 1;


describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      jest.spyOn(service as any, 'hashPassword').mockResolvedValue(MockHashedPassword);

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(userRepository, 'create').mockReturnValueOnce(MockExpectedResultOfUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfUser);

      const result = await service.createUser(MokUserDto);

      expect(result).toEqual(MockExpectedResultOfUser);
      expect(userRepository.create).toHaveBeenCalledWith({ ...MokUserDto, password: MockHashedPassword });
      expect(userRepository.save).toHaveBeenCalledWith(MockExpectedResultOfUser);
    });

    it('should throw ConflictException if user with the same email already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ id: 1, email: MokUserDto.email } as UserEntity);

      await expect(service.createUser(MokUserDto)).rejects.toThrow(ConflictException);
    });
  });
  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const existingUser = {
        id: userId,
        first_name: 'OldFirstName',
        last_name: 'OldLastName',
        phone: '987654321',
        photo: 'old-photo-url',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser as UserEntity);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({ ...existingUser, ...mockUpdateUserDto } as UserEntity);

      const result = await service.updateUser(userId, mockUpdateUserDto);

      expect(result).toEqual({ ...existingUser, ...mockUpdateUserDto });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(userRepository.save).toHaveBeenCalledWith({ ...existingUser, ...mockUpdateUserDto });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateUser(userId, mockUpdateUserDto)).rejects.toThrow(NotFoundException);
    });
  });
  describe('softDeleteUser', () => {
    it('should soft delete an existing user', async () => {
      jest.spyOn(userRepository, 'softDelete').mockResolvedValueOnce({ affected: 1 } as any);

      await service.softDeleteUser(userId);

      expect(userRepository.softDelete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'softDelete').mockResolvedValueOnce({ affected: 0 } as any);

      await expect(service.softDeleteUser(userId)).rejects.toThrow(NotFoundException);
    });
  });
  describe('getUserById', () => {
    it('should return the user if found', async () => {
      const mockUser: UserEntity = { id: userId, email: 'test@example.com' } as UserEntity;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.getUserById(userId)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });
  describe('findAll', () => {
    it('should return paginated data', async () => {
      const mockData = [
        { id: 1, email: 'test1@example.com' },
        { id: 2, email: 'test2@example.com' },
      ];

      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<UserEntity>;

      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAll(mockPage, mockLimit);

      expect(result.data).toEqual(mockData);
      expect(result.total).toEqual(mockData.length);
      expect(result.page).toEqual(mockPage);
      expect(result.limit).toEqual(mockLimit);
    });

    it('should throw NotFoundException if no data found', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
      } as unknown as SelectQueryBuilder<UserEntity>;

      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserByField', () => {
    it('should return user when found by field', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as UserEntity);

      const result = await service.getUserByField(mockField, mockValue);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { [mockField]: mockValue } });
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getUserByField(mockField, mockValue)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { [mockField]: mockValue } });
    });
  });
});
