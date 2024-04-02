import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoleService } from './role.service';
import { Roles } from './entities/role.entity';
import {
  mockPage,
  mockLimit,
  mockRoleId,
  mockCreatedRole,
  createRoleDto,
  mockData,
  mockUpdateRoleDto,
  existingRole,
  mockUpdateRole,
} from '../constants/mockRole';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: Repository<Roles>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, { provide: getRepositoryToken(Roles), useClass: Repository }],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<Repository<Roles>>(getRepositoryToken(Roles));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a new Role and returns the created Role with generated id', async () => {
      jest.spyOn(roleRepository, 'create').mockReturnValueOnce(mockCreatedRole);
      jest.spyOn(roleRepository, 'save').mockResolvedValueOnce(mockCreatedRole);

      const result = await service.create(createRoleDto);

      expect(result).toEqual(mockCreatedRole);
      expect(roleRepository.create).toHaveBeenCalledWith(createRoleDto);
      expect(roleRepository.save).toHaveBeenCalledWith(mockCreatedRole);
    });
  });

  describe('findAll', () => {
    it('should return  all Roles', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<Roles>;

      jest.spyOn(roleRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAll(mockPage, mockLimit);

      expect(result.data).toEqual(mockData);
      expect(result.total).toEqual(mockData.length);
      expect(result.page).toEqual(mockPage);
      expect(result.limit).toEqual(mockLimit);
    });

    it('should return empty array if no data found', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as unknown as SelectQueryBuilder<Roles>;

      jest.spyOn(roleRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValueOnce(mockCreatedRole);

      const result = await service.findOne(mockRoleId);

      expect(result).toEqual(mockCreatedRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: mockRoleId } });
    });

    it('should throw NotFoudExeption if Role is not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockImplementation();

      await expect(service.findOne(mockRoleId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the Role information', async () => {
      const updateRole = { ...existingRole, ...mockUpdateRoleDto } as Roles;

      jest.spyOn(roleRepository, 'findOne').mockResolvedValueOnce(existingRole);
      jest.spyOn(roleRepository, 'save').mockResolvedValueOnce(updateRole);

      const result = await service.update(mockRoleId, mockUpdateRoleDto);

      expect(result).toEqual(updateRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: mockRoleId } });
      expect(roleRepository.save).toHaveBeenCalledWith(updateRole);
    });

    it('should throw NotFoudExeption if Role does not  exist', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(mockRoleId, mockUpdateRole)).rejects.toThrow(NotFoundException);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRoleId },
      });
    });

    describe('softDelete', () => {
      it('should soft remove an existing Role', async () => {
        jest.spyOn(roleRepository, 'softDelete').mockResolvedValueOnce({ affected: 1 } as any);

        await service.softDelete(mockRoleId);

        expect(roleRepository.softDelete).toHaveBeenCalledWith(mockRoleId);
      });

      it('should throw NotExeption if user does not exist', async () => {
        jest.spyOn(roleRepository, 'softDelete').mockResolvedValueOnce({ affected: 0 } as any);

        await expect(service.softDelete(mockRoleId)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
