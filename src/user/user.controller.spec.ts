import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { mockUpdateUserDto, MokUserDto } from '../common/constants';
import { PaginatedData } from '../types/interface';

const mockUserId = '1';
const mockUser: UserEntity = new UserEntity();

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            updateUser: jest.fn(),
            softDeleteUser: jest.fn(),
            findAll: jest.fn(),
            getUserByField: jest.fn(),
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should return created user', async () => {
      jest.spyOn(userService, 'createUser').mockResolvedValueOnce(mockUser as UserEntity);

      const result = await controller.createUser(MokUserDto);

      expect(result).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledWith(MokUserDto);
    });

    it('should throw NotFoundException if user creation fails', async () => {
      jest.spyOn(userService, 'createUser').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.createUser(MokUserDto)).rejects.toThrow(NotFoundException);
      expect(userService.createUser).toHaveBeenCalledWith(MokUserDto);
    });
  });
  describe('updateUser', () => {
    it('should return updated user', async () => {
      const mockUser = {
        id: 1,
        first_name: mockUpdateUserDto.first_name,
        last_name: mockUpdateUserDto.last_name,
        phone: mockUpdateUserDto.phone,
        photo: mockUpdateUserDto.photo,
      };

      jest.spyOn(userService, 'updateUser').mockResolvedValueOnce(mockUser as UserEntity);

      const result = await controller.updateUser(mockUserId, mockUpdateUserDto);

      expect(result).toEqual(mockUser);
      expect(userService.updateUser).toHaveBeenCalledWith(+mockUserId, mockUpdateUserDto);
    });

    it('should throw NotFoundException if user update fails', async () => {
      jest.spyOn(userService, 'updateUser').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateUser(mockUserId, mockUpdateUserDto)).rejects.toThrow(NotFoundException);
      expect(userService.updateUser).toHaveBeenCalledWith(+mockUserId, mockUpdateUserDto);
    });
  });
  describe('softDeleteUser', () => {
    it('should successfully soft delete the user', async () => {
      await controller.softDeleteUser(mockUserId);

      expect(userService.softDeleteUser).toHaveBeenCalledWith(+mockUserId);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userService, 'softDeleteUser').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.softDeleteUser(mockUserId)).rejects.toThrow(NotFoundException);
      expect(userService.softDeleteUser).toHaveBeenCalledWith(+mockUserId);
    });
  });
  describe('findAll', () => {
    it('should return paginated data of users', async () => {
      const mockPage = '1';
      const mockLimit = '10';
      const mockResult: PaginatedData<UserEntity> = {
        data: [new UserEntity(), new UserEntity()],
        total: 2,
        page: 1,
        limit: 10,
      };

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(mockResult);

      const result = await controller.findAll(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(userService.findAll).toHaveBeenCalledWith(+mockPage, +mockLimit);
    });
  });
  describe('getUserByField', () => {
    it('should return user by field name and value', async () => {
      const mockFieldName = 'email';
      const mockValue = 'test@example.com';

      jest.spyOn(userService, 'getUserByField').mockResolvedValueOnce(mockUser);

      const result = await controller.getUserByField(mockFieldName, mockValue);

      expect(result).toEqual(mockUser);
      expect(userService.getUserByField).toHaveBeenCalledWith(mockFieldName, mockValue);
    });
  });
  describe('getUserById', () => {
    it('should return user by id', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(mockUser);

      const result = await controller.getUserById(mockUserId);

      expect(result).toEqual(mockUser);
      expect(userService.getUserById).toHaveBeenCalledWith(+mockUserId);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userService, 'getUserById').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getUserById(mockUserId)).rejects.toThrow(NotFoundException);
      expect(userService.getUserById).toHaveBeenCalledWith(+mockUserId);
    });
  });
});
