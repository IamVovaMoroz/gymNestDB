import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AplicationsService } from './aplications.service';
import { Aplications } from './entities/aplication.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import {
  mockPage,
  mockLimit,
  mockAplicationId,
  mockCreateAplicationDto,
  mockCreatedAplication,
  mockData,
  mockUpdateAplicationDto,
  existingAplication,
  mockUpdateAplication,
} from '../common/constants/mockAplications';

describe('AplicationsService', () => {
  let service: AplicationsService;
  let aplicationRepository: Repository<Aplications>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AplicationsService, { provide: getRepositoryToken(Aplications), useClass: Repository }],
    }).compile();

    service = module.get<AplicationsService>(AplicationsService);
    aplicationRepository = module.get<Repository<Aplications>>(getRepositoryToken(Aplications));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a new Aplication and returns the created Aplication with generated id', async () => {
      jest.spyOn(aplicationRepository, 'create').mockReturnValueOnce(mockCreatedAplication);
      jest.spyOn(aplicationRepository, 'save').mockResolvedValueOnce(mockCreatedAplication);

      const result = await service.create(mockCreateAplicationDto);

      expect(result).toEqual(mockCreatedAplication);
      expect(aplicationRepository.create).toHaveBeenCalledWith(mockCreateAplicationDto);
      expect(aplicationRepository.save).toHaveBeenCalledWith(mockCreatedAplication);
    });
  });

  describe('findAll', () => {
    it('should return  all Aplications', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<Aplications>;

      jest.spyOn(aplicationRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

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
      } as unknown as SelectQueryBuilder<Aplications>;

      jest.spyOn(aplicationRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(aplicationRepository, 'findOne').mockResolvedValueOnce(mockCreatedAplication);

      const result = await service.findOne(mockAplicationId);

      expect(result).toEqual(mockCreatedAplication);
      expect(aplicationRepository.findOne).toHaveBeenCalledWith({ where: { id: mockAplicationId } });
    });

    it('should throw NotFoudExeption if Aplication is not found', async () => {
      jest.spyOn(aplicationRepository, 'findOne').mockImplementation();

      await expect(service.findOne(mockAplicationId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the Aplication information', async () => {
      const updateAplication = { ...existingAplication, ...mockUpdateAplicationDto } as Aplications;

      jest.spyOn(aplicationRepository, 'findOne').mockResolvedValueOnce(existingAplication);
      jest.spyOn(aplicationRepository, 'save').mockResolvedValueOnce(updateAplication);

      const result = await service.update(mockAplicationId, mockUpdateAplicationDto);

      expect(result).toEqual(updateAplication);
      expect(aplicationRepository.findOne).toHaveBeenCalledWith({ where: { id: mockAplicationId } });
      expect(aplicationRepository.save).toHaveBeenCalledWith(updateAplication);
    });

    it('should throw NotFoudExeption if Aplication does not  exist', async () => {
      jest.spyOn(aplicationRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(mockAplicationId, mockUpdateAplication)).rejects.toThrow(NotFoundException);
      expect(aplicationRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockAplicationId },
      });
    });

    describe('softDelete', () => {
      it('should soft remove an existing Aplication', async () => {
        jest.spyOn(aplicationRepository, 'softDelete').mockResolvedValueOnce({ affected: 1 } as any);

        await service.softDelete(mockAplicationId);

        expect(aplicationRepository.softDelete).toHaveBeenCalledWith(mockAplicationId);
      });

      it('should throw NotExeption if user does not exist', async () => {
        jest.spyOn(aplicationRepository, 'softDelete').mockResolvedValueOnce({ affected: 0 } as any);

        await expect(service.softDelete(mockAplicationId)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
