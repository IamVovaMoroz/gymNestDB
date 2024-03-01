import { Test, TestingModule } from '@nestjs/testing';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { TypesEntity } from './entities/type.entity';
import { NotFoundException } from '@nestjs/common';
import { MockTypeDto, mockUpdateTypeDto } from '../common/constants/mockType';
import { PaginatedData } from '../types/interface';

const mockTypeId = '1';
const mockType: TypesEntity = new TypesEntity();

describe('TypeController', () => {
  let controller: TypeController;
  let typeService: TypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        {
          provide: TypeService,
          useValue: {
            createTypes: jest.fn(),
            updateTypes: jest.fn(),
            deleteTypes: jest.fn(),
            findAllTypes: jest.fn(),
            getTypesById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TypeController>(TypeController);
    typeService = module.get<TypeService>(TypeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTypes', () => {
    it('should return created Type', async () => {
      jest.spyOn(typeService, 'createTypes' as keyof TypeService).mockResolvedValueOnce(mockType as TypesEntity);


      const result = await controller.createTypes(MockTypeDto);

      expect(result).toEqual(mockType);
      expect(typeService.createTypes).toHaveBeenCalledWith(MockTypeDto);
    });

    it('should throw NotFoundException if Type creation fails', async () => {
      jest.spyOn(typeService, 'createTypes' as keyof TypeService).mockRejectedValueOnce(new NotFoundException());


      await expect(controller.createTypes(MockTypeDto)).rejects.toThrow(NotFoundException);
      expect(typeService.createTypes).toHaveBeenCalledWith(MockTypeDto);
    });
  });

  describe('updateTypes', () => {
    it('should return updated type', async () => {
      const updatedType = new TypesEntity();
      updatedType.id = 1;
      updatedType.value = mockUpdateTypeDto.value;
      updatedType.visible = mockUpdateTypeDto.visible;

      jest.spyOn(typeService, 'updateTypes').mockResolvedValueOnce(updatedType);

      const result = await controller.updateTypes(mockTypeId, mockUpdateTypeDto);

      expect(result.id).toEqual(updatedType.id);
      expect(result.value).toEqual(updatedType.value);
      expect(result.visible).toEqual(updatedType.visible);
      expect(typeService.updateTypes).toHaveBeenCalledWith(+mockTypeId, mockUpdateTypeDto);
    });

    it('should throw NotFoundException if type update fails', async () => {
      jest.spyOn(typeService, 'updateTypes').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateTypes(mockTypeId, mockUpdateTypeDto)).rejects.toThrow(NotFoundException);
      expect(typeService.updateTypes).toHaveBeenCalledWith(+mockTypeId, mockUpdateTypeDto);
    });
  });


  describe('deleteTypes', () => {
    it('should successfully delete the Type', async () => {
      await controller.deleteTypes(mockTypeId);
      expect(typeService.deleteTypes).toHaveBeenCalledWith(+mockTypeId);
    });

    it('should throw NotFoundException if Type does not exist', async () => {
      jest.spyOn(typeService, 'deleteTypes').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteTypes(mockTypeId)).rejects.toThrow(NotFoundException);
      expect(typeService.deleteTypes).toHaveBeenCalledWith(+mockTypeId);
    });
  });

  describe('findAllTypes', () => {
    it('should return paginated data of Types', async () => {
      const mockPage = '1';
      const mockLimit = '10';
      const mockResult: PaginatedData<TypesEntity> = {
        data: [new TypesEntity(), new TypesEntity()],
        total: 2,
        page: 1,
        limit: 10,
      };

      jest.spyOn(typeService, 'findAllTypes').mockResolvedValueOnce(mockResult);

      const result = await controller.findAllTypes(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(typeService.findAllTypes).toHaveBeenCalledWith(+mockPage, +mockLimit);
    });
  });

  describe('getTypesById', () => {
    it('should return Type by id', async () => {
      jest.spyOn(typeService, 'getTypesById' as keyof TypeService).mockResolvedValueOnce(mockType);


      const result = await controller.getTypesById(mockTypeId);

      expect(result).toEqual(mockType);
      expect(typeService.getTypesById).toHaveBeenCalledWith(+mockTypeId);
    });

    it('should throw NotFoundException if Type not found', async () => {
      jest.spyOn(typeService, 'getTypesById' as keyof TypeService).mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getTypesById(mockTypeId)).rejects.toThrow(NotFoundException);
      expect(typeService.getTypesById).toHaveBeenCalledWith(+mockTypeId);
    });
  });
});
