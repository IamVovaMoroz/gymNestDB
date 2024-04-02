import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Roles } from './entities/role.entity';
import { IPaginatedData } from 'src/types/interface';
import { createRoleDto, mockCreatedRole } from '../../common/constants/mockRole';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: RoleService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('creates a new Role and returns the created Role with generated id', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockCreatedRole);

      const result = await controller.create(createRoleDto);

      expect(result).toEqual(mockCreatedRole);
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
    });

    it('should throw NotFoundException if Role creation fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.create(createRoleDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findAll', () => {
    it('should return  all Roles', async () => {
      const mockResult: IPaginatedData<Roles> = { data: mockData, total: 2, page: 1, limit: 10 };

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockResult);

      const result = await controller.findAll(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });

    it('should throw NotFoundException if Roles not found', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });
  });

  describe('findOneById', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(findRole);

      const result = await controller.findOne(mockRoleId);

      expect(result).toEqual(findRole);
      expect(service.findOne).toHaveBeenCalledWith(mockRoleId);
    });

    it('should throw NotFoundException if Aplication not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne(mockRoleId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(mockRoleId);
    });
  });

  describe('update', () => {
    it('should update the Role information', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(mockUpdatedRole);

      const result = await controller.update(mockRoleId, mockUpdateRoleDto);

      expect(result).toEqual(mockUpdatedRole);
      expect(service.update).toHaveBeenCalledWith(mockRoleId, mockUpdateRoleDto);
    });

    it('should throw NotFoundException if user update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update(mockRoleId, mockUpdateRoleDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(mockRoleId, mockUpdateRoleDto);
    });
  });

  describe('softDelete', () => {
    it('should soft remove an existing Role', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValueOnce();

      await controller.softDelete(mockRoleId);

      expect(service.softDelete).toHaveBeenCalledWith(mockRoleId);
    });

    it('should throw NotFoundException if Role does not exist', async () => {
      jest.spyOn(service, 'softDelete').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.softDelete(mockRoleId)).rejects.toThrow(NotFoundException);
      expect(service.softDelete).toHaveBeenCalledWith(mockRoleId);
    });
  });
});
