import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from './type.service';
import { TypesEntity } from './entities/type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { MockExpectedResultOfType, mockUpdateTypeDto } from '../../common/constants';
import { TypesCreateDto } from './dto/type.create.dto';

const mockPage = 1;
const mockLimit = 10;
const mockTypeId = 1;

// const mockType: TypesEntity = new TypesEntity();

describe('TypeService', () => {
  let service: TypeService;
  let typeRepository: Repository<TypesEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeService,
        {
          provide: getRepositoryToken(TypesEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TypeService>(TypeService);
    typeRepository = module.get<Repository<TypesEntity>>(getRepositoryToken(TypesEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTypes', () => {
    it('should create a new type', async () => {
      const mockDto: TypesCreateDto = {
        value: 'example_value3',
        visible: true,
      };

      jest.spyOn(typeRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(typeRepository, 'create').mockReturnValueOnce(MockExpectedResultOfType);
      jest.spyOn(typeRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfType);

      // Call the method that should invoke statusRepository.create
      await service.createTypes(mockDto);

      // Check if statusRepository.create was called with the expected arguments
      expect(typeRepository.create).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('updateTypes', () => {
    it('should update an existing type', async () => {
      const existingType: TypesEntity = {
        id: 1,
        value: 'Some value',
        visible: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(typeRepository, 'findOne').mockResolvedValueOnce(existingType);
      jest.spyOn(typeRepository, 'save').mockResolvedValueOnce({ ...existingType, ...mockUpdateTypeDto });

      const result = await service.updateTypes(mockTypeId, mockUpdateTypeDto);

      expect(result).toEqual({ ...existingType, ...mockUpdateTypeDto });
      expect(typeRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTypeId } }); // Corrected expectation
      expect(typeRepository.save).toHaveBeenCalledWith({ ...existingType, ...mockUpdateTypeDto });
    });

    it('should throw NotFoundException if type does not exist', async () => {
      jest.spyOn(typeRepository, 'findOne').mockResolvedValueOnce(null);
      const saveSpy = jest.spyOn(typeRepository, 'save');

      await expect(service.updateTypes(mockTypeId, mockUpdateTypeDto)).rejects.toThrow(NotFoundException);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteType', () => {
    it('should delete an existing type', async () => {
      jest.spyOn(typeRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await service.deleteTypes(mockTypeId);

      expect(typeRepository.delete).toHaveBeenCalledWith(mockTypeId);
    });

    it('should throw NotFoundException if type does not exist', async () => {
      jest.spyOn(typeRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as DeleteResult);

      await expect(service.deleteTypes(mockTypeId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllTypes', () => {
    it('should return paginated data of types', async () => {
      const mockData = [
        { id: 1, value: 'Type 1', visible: true },
        { id: 2, value: 'Type 2', visible: true },
      ];

      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<TypesEntity>;

      jest.spyOn(typeRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAllTypes(mockPage, mockLimit);

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
      } as unknown as SelectQueryBuilder<TypesEntity>;

      jest.spyOn(typeRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAllTypes(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTypesById', () => {
    it('should return type by id', async () => {
      const mockType: TypesEntity = { id: mockTypeId, value: 'Test Type', visible: true } as TypesEntity;
      (jest.spyOn(typeRepository, 'findOne') as jest.Mock).mockReturnValueOnce(mockType);

      const result = await service.getTypesById(mockTypeId);

      expect(result).toEqual(mockType);
      expect(typeRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTypeId } });
    });

    it('should throw NotFoundException if type does not exist', async () => {
      (jest.spyOn(typeRepository, 'findOne') as jest.Mock).mockReturnValueOnce(undefined);

      await expect(service.getTypesById(mockTypeId)).rejects.toThrow(NotFoundException);
    });
  });
});
