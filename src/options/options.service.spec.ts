import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { OptionEntity } from './entities/option.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { MockExpectedResultOfOption, mockUpdateOptionDto } from '../common/constants';
import { OptionCreateDto } from './dto/option.create.dto';

const mockPage = 1;
const mockLimit = 10;
const mockOptionId = 1;

describe('OptionsService', () => {
  let service: OptionsService;
  let optionRepository: Repository<OptionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionsService,
        {
          provide: getRepositoryToken(OptionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OptionsService>(OptionsService);
    optionRepository = module.get<Repository<OptionEntity>>(getRepositoryToken(OptionEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOption', () => {
    it('should create a new option', async () => {
      const mockDto: OptionCreateDto = {
        key: 'example_key',
        value: 'example_value',
        visible: true,
        autoload: true,
        created_at: new Date(),
      };

      jest.spyOn(optionRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(optionRepository, 'create').mockReturnValueOnce(MockExpectedResultOfOption);
      jest.spyOn(optionRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfOption);

      // Call the method that should invoke optionRepository.create
      await service.createOption(mockDto);

      // Check if optionRepository.create was called with the expected arguments
      expect(optionRepository.create).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('updateOption', () => {
    it('should update an existing option', async () => {
      const existingOption: OptionEntity = {
        id: 1,
        value: 'Some value',
        visible: true,
        autoload: true,
        key: 'example_key',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(optionRepository, 'findOne').mockResolvedValueOnce(existingOption);
      jest.spyOn(optionRepository, 'save').mockResolvedValueOnce({ ...existingOption, ...mockUpdateOptionDto });

      const result = await service.updateOption(mockOptionId, mockUpdateOptionDto);

      expect(result).toEqual({ ...existingOption, ...mockUpdateOptionDto });
      expect(optionRepository.findOne).toHaveBeenCalledWith({ where: { id: mockOptionId } }); // Corrected expectation
      expect(optionRepository.save).toHaveBeenCalledWith({ ...existingOption, ...mockUpdateOptionDto });
    });

    it('should throw NotFoundException if option does not exist', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValueOnce(null);
      const saveSpy = jest.spyOn(optionRepository, 'save');

      await expect(service.updateOption(mockOptionId, mockUpdateOptionDto)).rejects.toThrow(NotFoundException);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteOption', () => {
    it('should delete an existing option', async () => {
      jest.spyOn(optionRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await service.deleteOption(mockOptionId);

      expect(optionRepository.delete).toHaveBeenCalledWith(mockOptionId);
    });

    it('should throw NotFoundException if option does not exist', async () => {
      jest.spyOn(optionRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as DeleteResult);

      await expect(service.deleteOption(mockOptionId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllOptions', () => {
    it('should return paginated data of options', async () => {
      const mockData = [
        { id: 1, value: 'Option 1', visible: true },
        { id: 2, value: 'Option 2', visible: true },
      ];

      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<OptionEntity>;

      jest.spyOn(optionRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAllOptions(mockPage, mockLimit);

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
      } as unknown as SelectQueryBuilder<OptionEntity>;

      jest.spyOn(optionRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAllOptions(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOptionById', () => {
    it('should return option by id', async () => {
      const mockOption: OptionEntity = { id: mockOptionId, value: 'Test Option', visible: true } as OptionEntity;
      (jest.spyOn(optionRepository, 'findOne') as jest.Mock).mockReturnValueOnce(mockOption);

      const result = await service.getOptionById(mockOptionId);

      expect(result).toEqual(mockOption);
      expect(optionRepository.findOne).toHaveBeenCalledWith({ where: { id: mockOptionId } });
    });

    it('should throw NotFoundException if option does not exist', async () => {
      (jest.spyOn(optionRepository, 'findOne') as jest.Mock).mockReturnValueOnce(undefined);

      await expect(service.getOptionById(mockOptionId)).rejects.toThrow(NotFoundException);
    });
  });
});
