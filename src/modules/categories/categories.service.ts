import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IPaginatedData } from '../../types/interface';
import { paginate } from '../../common';


@Injectable()
export class CategoriesService {
  private readonly logger: Logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const newCategory = this.categoryRepository.create({ ...createCategoryDto });
    await this.categoryRepository.save(newCategory);
    this.logger.log(`Category created: ${newCategory.id}`);
    return newCategory;
  }

  async findAllCategory(page: number, limit: number): Promise<IPaginatedData<CategoryEntity>> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('Category');
    return paginate<CategoryEntity>(queryBuilder, +page, +limit);
  }

  async findOneByIdCategory(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category is not found');
    }
    return category;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      this.logger.warn(`Category not found with ID: ${id}`);

      throw new NotFoundException('Category is not found');
    }
    const updateCategory = { ...category, ...updateCategoryDto };
    this.logger.log(`Updated category: ${updateCategory.id}`);
    return await this.categoryRepository.save(updateCategory);
  }

  async softDeleteCategory(id: number): Promise<void> {
    const result = await this.categoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`categoryRepository with ID ${id} not found`);
    }
    this.logger.log(`Successfully soft-deleted categoryRepository with ID: ${id}`);
  }
}
