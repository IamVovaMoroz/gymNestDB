import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from './entities/service.entity';
import {
  mockServiceId,
  createdService,
  createServiceDto,
  mockData,
  mockService,
  mockUpdateServiceDto,
  mockUpdateService,
  mockPage,
  mockLimit,
  existingService,
} from '../constants';

describe('ServicesService', () => {
  let service: ServicesService;
  let serviceRepository: Repository<Services>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicesService, { provide: getRepositoryToken(Services), useClass: Repository }],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    serviceRepository = module.get<Repository<Services>>(getRepositoryToken(Services));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a new service and returns the created service with generated id', async () => {
      jest.spyOn(serviceRepository, 'create').mockReturnValueOnce(createdService);
      jest.spyOn(serviceRepository, 'save').mockResolvedValueOnce(createdService);

      const result = await service.create(createServiceDto);

      expect(result).toEqual(createdService);
      expect(serviceRepository.create).toHaveBeenCalledWith(createServiceDto);
      expect(serviceRepository.save).toHaveBeenCalledWith(createdService);
    });
  });

  describe('findAll', () => {
    it('should return  all services', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<Services>;

      jest.spyOn(serviceRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

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
      } as unknown as SelectQueryBuilder<Services>;

      jest.spyOn(serviceRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValueOnce(mockService);

      const result = await service.findOneById(mockServiceId);

      expect(result).toEqual(mockService);
      expect(serviceRepository.findOne).toHaveBeenCalledWith({ where: { id: mockServiceId } });
    });

    it('should throw NotFoudExeption if service is not found', async () => {
      jest.spyOn(serviceRepository, 'findOne').mockImplementation();

      await expect(service.findOneById(mockServiceId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the service information', async () => {
      const updateService = { ...existingService, ...mockUpdateServiceDto } as Services;

      jest.spyOn(serviceRepository, 'findOne').mockResolvedValueOnce(existingService);
      jest.spyOn(serviceRepository, 'save').mockResolvedValueOnce(updateService);

      const result = await service.update(mockServiceId, mockUpdateServiceDto);

      expect(result).toEqual(updateService);
      expect(serviceRepository.findOne).toHaveBeenCalledWith({ where: { id: mockServiceId } });
      expect(serviceRepository.save).toHaveBeenCalledWith(updateService);
    });

    it('should throw NotFoudExeption if service does not  exist', async () => {
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(mockServiceId, mockUpdateService)).rejects.toThrow(NotFoundException);
      expect(serviceRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockServiceId },
      });
    });

    describe('softDelete', () => {
      it('should soft remove an existing service', async () => {
        jest.spyOn(serviceRepository, 'softDelete').mockResolvedValueOnce({ affected: 1 } as any);

        await service.softDelete(mockServiceId);

        expect(serviceRepository.softDelete).toHaveBeenCalledWith(mockServiceId);
      });

      it('should throw NotExeption if user does not exist', async () => {
        jest.spyOn(serviceRepository, 'softDelete').mockResolvedValueOnce({ affected: 0 } as any);

        await expect(service.softDelete(mockServiceId)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
