import { Test, TestingModule } from '@nestjs/testing';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { OptionEntity } from './entities/option.entity';
import { NotFoundException } from '@nestjs/common';
import { MockOptionDto, mockUpdateOptionDto } from '../common/constants';
import { PaginatedData } from '../types/interface';

const mockOptionId = '1';
const mockOption = new OptionEntity();

describe('OptionsController', () => {
  let controller: OptionsController;
  let optionsService: OptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        {
          provide: OptionsService,
          useValue: {
            createOption: jest.fn(),
            updateOption: jest.fn(),
            deleteOption: jest.fn(),
            getOptionById: jest.fn(),
            findAllOptions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
    optionsService = module.get<OptionsService>(OptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOption', () => {
    it('should return created Option', async () => {
      jest.spyOn(optionsService, 'createOption').mockResolvedValueOnce(mockOption);


      const result = await controller.createOption(MockOptionDto);

      expect(result).toEqual(mockOption);
      expect(optionsService.createOption).toHaveBeenCalledWith(MockOptionDto);
    });

    it('should throw NotFoundException if Option creation fails', async () => {
      jest.spyOn(optionsService, 'createOption').mockRejectedValueOnce(new NotFoundException());


      await expect(controller.createOption(MockOptionDto)).rejects.toThrow(NotFoundException);
      expect(optionsService.createOption).toHaveBeenCalledWith(MockOptionDto);
    });
  });

  describe('updateOption', () => {
    it('should return updated option', async () => {
      const updatedOption = new OptionEntity();
      updatedOption.id = 1;
      updatedOption.value = mockUpdateOptionDto.value;
      updatedOption.visible = mockUpdateOptionDto.visible;

      jest.spyOn(optionsService, 'updateOption').mockResolvedValueOnce(updatedOption);

      const result = await controller.updateOption(mockOptionId, mockUpdateOptionDto);

      expect(result.id).toEqual(updatedOption.id);
      expect(result.value).toEqual(updatedOption.value);
      expect(result.visible).toEqual(updatedOption.visible);
      expect(optionsService.updateOption).toHaveBeenCalledWith(+mockOptionId, mockUpdateOptionDto);
    });

    it('should throw NotFoundException if option update fails', async () => {
      jest.spyOn(optionsService, 'updateOption').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateOption(mockOptionId, mockUpdateOptionDto)).rejects.toThrow(NotFoundException);
      expect(optionsService.updateOption).toHaveBeenCalledWith(+mockOptionId, mockUpdateOptionDto);
    });
  });

  describe('deleteOption', () => {
    it('should successfully delete the Option', async () => {
      await controller.deleteOption(mockOptionId);
      expect(optionsService.deleteOption).toHaveBeenCalledWith(+mockOptionId);
    });

    it('should throw NotFoundException if Option does not exist', async () => {
      jest.spyOn(optionsService, 'deleteOption').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteOption(mockOptionId)).rejects.toThrow(NotFoundException);
      expect(optionsService.deleteOption).toHaveBeenCalledWith(+mockOptionId);
    });
  });

  describe('findAllOptions', () => {
    it('should return paginated data of Options', async () => {
      const mockPage = '1';
      const mockLimit = '10';
      const mockResult: PaginatedData<OptionEntity> = {
        data: [new OptionEntity(), new OptionEntity()],
        total: 2,
        page: 1,
        limit: 10,
      };

      jest.spyOn(optionsService, 'findAllOptions').mockResolvedValueOnce(mockResult);


      const result = await controller.findAllOptions(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(optionsService.findAllOptions).toHaveBeenCalledWith(+mockPage, +mockLimit);
    });
  });

  describe('getOptionById', () => {
    it('should return Option by id', async () => {
      jest.spyOn(optionsService, 'getOptionById' as keyof OptionsService).mockResolvedValueOnce(mockOption);


      const result = await controller.getOptionById(mockOptionId);

      expect(result).toEqual(mockOption);
      expect(optionsService.getOptionById).toHaveBeenCalledWith(+mockOptionId);
    });

    it('should throw NotFoundException if Option not found', async () => {
      jest.spyOn(optionsService, 'getOptionById' as keyof OptionsService).mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getOptionById(mockOptionId)).rejects.toThrow(NotFoundException);
      expect(optionsService.getOptionById).toHaveBeenCalledWith(+mockOptionId);
    });
  });
});

