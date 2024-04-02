import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Services } from './entities/service.entity';
import { IPaginatedData } from '../../types/interface';
import {
  mockPage,
  mockLimit,
  mockServiceId,
  createdService,
  createServiceDto,
  mockData,
  mockService,
  mockUpdateServiceDto,
  mockUpdatedService,
} from '../constants';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        ServicesService,
        {
          provide: ServicesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('creates a new service and returns the created service with generated id', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(createdService);

      const result = await controller.create(createServiceDto);

      expect(result).toEqual(createdService);
      expect(service.create).toHaveBeenCalledWith(createServiceDto);
    });

    it('should throw NotFoundException if Service creation fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.create(createServiceDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('findAll', () => {
    it('should return  all services', async () => {
      const mockResult: IPaginatedData<Services> = { data: mockData, total: 2, page: 1, limit: 10 };

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockResult);

      const result = await controller.findAll(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });

    it('should throw NotFoundException if Services not found', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });
  });

  describe('findOneById', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(mockService);

      const result = await controller.findOneById(mockServiceId);

      expect(result).toEqual(mockService);
      expect(service.findOneById).toHaveBeenCalledWith(mockServiceId);
    });

    it('should throw NotFoundException if Aplication not found', async () => {
      jest.spyOn(service, 'findOneById').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOneById(mockServiceId)).rejects.toThrow(NotFoundException);
      expect(service.findOneById).toHaveBeenCalledWith(mockServiceId);
    });
  });

  describe('update', () => {
    it('should update the service information', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(mockUpdatedService);

      const result = await controller.update(mockServiceId, mockUpdateServiceDto);

      expect(result).toEqual(mockUpdatedService);
      expect(service.update).toHaveBeenCalledWith(mockServiceId, mockUpdateServiceDto);
    });

    it('should throw NotFoundException if Service update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update(mockServiceId, mockUpdateServiceDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(mockServiceId, mockUpdateServiceDto);
    });
  });

  describe('softDelete', () => {
    it('should soft remove an existing service', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValueOnce();

      await controller.softDelete(mockServiceId);

      expect(service.softDelete).toHaveBeenCalledWith(mockServiceId);
    });

    it('should throw NotFoundException if Service does not exist', async () => {
      jest.spyOn(service, 'softDelete').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.softDelete(mockServiceId)).rejects.toThrow(NotFoundException);
      expect(service.softDelete).toHaveBeenCalledWith(mockServiceId);
    });
  });
});
