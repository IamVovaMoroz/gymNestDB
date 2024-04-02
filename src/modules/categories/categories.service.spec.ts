import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockPage = 1;
const mockLimit = 10;
const mockCategoryId = 1;

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { value: 'Test Category' };
      const expectedResult = { id: 1, value: 'Test Category' };

      jest.spyOn(categoryRepository, 'create').mockReturnValueOnce(expectedResult as CategoryEntity);
      jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce(expectedResult as CategoryEntity);

      const result = await service.createCategory(createCategoryDto);

      expect(result).toEqual(expectedResult);
      expect(categoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(categoryRepository.save).toHaveBeenCalledWith(expectedResult);
    });
  });
  describe('findAllCategory', () => {
    it('should return paginated data', async () => {
      const mockData = [
        { id: 1, value: 'test1' },
        { id: 2, value: 'test2' },
      ];

      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<CategoryEntity>;

      jest.spyOn(categoryRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAllCategory(mockPage, mockLimit);

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
      } as unknown as SelectQueryBuilder<CategoryEntity>;

      jest.spyOn(categoryRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAllCategory(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });
  describe('softDeleteCategory', () => {
    it('should soft delete an existing user', async () => {
      jest.spyOn(categoryRepository, 'softDelete').mockResolvedValueOnce({ affected: 1 } as any);

      await service.softDeleteCategory(mockCategoryId);

      expect(categoryRepository.softDelete).toHaveBeenCalledWith(mockCategoryId);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(categoryRepository, 'softDelete').mockResolvedValueOnce({ affected: 0 } as any);

      await expect(service.softDeleteCategory(mockCategoryId)).rejects.toThrow(NotFoundException);
    });
  });
  describe('getUserById', () => {
    it('should return the user if found', async () => {
      const mockCategory: CategoryEntity = { id: mockCategoryId, value: 'test' } as CategoryEntity;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(mockCategory);

      const result = await service.findOneByIdCategory(mockCategoryId);

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { id: mockCategoryId } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findOneByIdCategory(mockCategoryId)).rejects.toThrow(NotFoundException);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { id: mockCategoryId } });
    });
  });
  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { value: 'Updated Category' };

      const existingCategory = { id: categoryId, value: 'Old Category' } as CategoryEntity;
      const updatedCategory = { ...existingCategory, ...updateCategoryDto } as CategoryEntity;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(existingCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce(updatedCategory);

      const result = await service.updateCategory(categoryId, updateCategoryDto);

      expect(result).toEqual(updatedCategory);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
      expect(categoryRepository.save).toHaveBeenCalledWith(updatedCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { value: 'Updated Category' };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateCategory(categoryId, updateCategoryDto)).rejects.toThrow(NotFoundException);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
    });
  });
});
