import { Test, TestingModule } from '@nestjs/testing';
import { AplicationsController } from './aplications.controller';
import { AplicationsService } from './aplications.service';
import { NotFoundException } from '@nestjs/common';
import {
  mockPage,
  mockLimit,
  mockAplicationId,
  mockCreateAplicationDto,
  mockCreatedAplication,
  mockUpdateAplicationDto,
  mockUpdatedAplication,
  mockFindAplication,
  mockResult,
} from '../common/constants/mockAplications';

describe('AplicationsController', () => {
  let controller: AplicationsController;
  let service: AplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AplicationsController],
      providers: [
        AplicationsService,
        {
          provide: AplicationsService,
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

    controller = module.get<AplicationsController>(AplicationsController);
    service = module.get<AplicationsService>(AplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('creates a new Aplication and returns the created Aplication with generated id', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockCreatedAplication);

      const result = await controller.create(mockCreateAplicationDto);

      expect(result).toEqual(mockCreatedAplication);
      expect(service.create).toHaveBeenCalledWith(mockCreateAplicationDto);
    });

    it('should throw NotFoundException if Aplication creation fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.create(mockCreateAplicationDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(mockCreateAplicationDto);
    });
  });

  describe('findAll', () => {
    it('should return  all Aplications', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockResult);

      const result = await controller.findAll(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });

    it('should throw NotFoundException if Aplications not found', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });
  });

  describe('findOne', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockFindAplication);

      const result = await controller.findOne(mockAplicationId);

      expect(result).toEqual(mockFindAplication);
      expect(service.findOne).toHaveBeenCalledWith(mockAplicationId);
    });

    it('should throw NotFoundException if Aplication not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne(mockAplicationId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(mockAplicationId);
    });
  });

  describe('update', () => {
    it('should update the Aplication information', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(mockUpdatedAplication);

      const result = await controller.update(mockAplicationId, mockUpdateAplicationDto);

      expect(result).toEqual(mockUpdatedAplication);
      expect(service.update).toHaveBeenCalledWith(mockAplicationId, mockUpdateAplicationDto);
    });

    it('should throw NotFoundException if user update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update(mockAplicationId, mockUpdateAplicationDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(mockAplicationId, mockUpdateAplicationDto);
    });
  });

  describe('softDelete', () => {
    it('should soft remove an existing Aplication', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValueOnce();

      await controller.softDelete(mockAplicationId);

      expect(service.softDelete).toHaveBeenCalledWith(mockAplicationId);
    });

    it('should throw NotFoundException if Aplicaion does not exist', async () => {
      jest.spyOn(service, 'softDelete').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.softDelete(mockAplicationId)).rejects.toThrow(NotFoundException);
      expect(service.softDelete).toHaveBeenCalledWith(mockAplicationId);
    });
  });
});
