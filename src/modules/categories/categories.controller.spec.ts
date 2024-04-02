import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { IPaginatedData } from '../types/interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: CategoriesService,
          useValue: {
            createCategory: jest.fn(),
            findAllCategory: jest.fn(),
            findOneByIdCategory: jest.fn(),
            updateCategory: jest.fn(),
            softDeleteCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { value: 'Test Category' };
      const createdCategory: CategoryEntity = { id: 1, value: 'Test Category' } as CategoryEntity;

      jest.spyOn(service, 'createCategory').mockResolvedValueOnce(createdCategory);

      const result = await controller.createCategory(createCategoryDto);

      expect(result).toEqual(createdCategory);
      expect(service.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });
  });
  describe('findAllCategory', () => {
    it('should return paginated data', async () => {
      const mockPage = '1';
      const mockLimit = '10';
      const mockData: CategoryEntity[] = [
        { id: 1, value: 'Category 1' },
        { id: 2, value: 'Category 2' },
      ] as CategoryEntity[];
      const mockResult: IPaginatedData<CategoryEntity> = { data: mockData, total: 2, page: 1, limit: 10 };

      jest.spyOn(service, 'findAllCategory').mockResolvedValueOnce(mockResult);

      const result = await controller.findAllCategory(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(service.findAllCategory).toHaveBeenCalledWith(+mockPage, +mockLimit);
    });
  });
  describe('findOneByIdCategory', () => {
    it('should return a category by ID', async () => {
      const mockId = '1';
      const mockCategory: CategoryEntity = { id: 1, value: 'Category 1' } as CategoryEntity;

      jest.spyOn(service, 'findOneByIdCategory').mockResolvedValueOnce(mockCategory);

      const result = await controller.findOneByIdCategory(mockId);

      expect(result).toEqual(mockCategory);
      expect(service.findOneByIdCategory).toHaveBeenCalledWith(+mockId);
    });
  });
  describe('updateCategory', () => {
    it('should update a category', async () => {
      const mockId = '1';
      const mockUpdateCategoryDto: UpdateCategoryDto = { value: 'Updated Category' };
      const mockUpdatedCategory: CategoryEntity = { id: 1, value: 'Updated Category' } as CategoryEntity;

      jest.spyOn(service, 'updateCategory').mockResolvedValueOnce(mockUpdatedCategory);

      const result = await controller.updateCategory(mockId, mockUpdateCategoryDto);

      expect(result).toEqual(mockUpdatedCategory);
      expect(service.updateCategory).toHaveBeenCalledWith(+mockId, mockUpdateCategoryDto);
    });
  });
  describe('softDeleteCategory', () => {
    it('should soft delete a category', async () => {
      const mockId = '1';

      jest.spyOn(service, 'softDeleteCategory').mockResolvedValueOnce();

      await controller.softDeleteCategory(mockId);

      expect(service.softDeleteCategory).toHaveBeenCalledWith(+mockId);
    });
  });
});
