import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPaginatedData } from '../../types/interface';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }
  @ApiResponse({ type: CategoryEntity, isArray: true })
  @Get()
  async findAllCategory(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<IPaginatedData<CategoryEntity>> {
    return this.categoriesService.findAllCategory(+page, +limit);
  }

  @Get(':id')
  async findOneByIdCategory(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOneByIdCategory(+id);
  }

  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }
  @Delete(':id')
  async softDeleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoriesService.softDeleteCategory(+id);
  }
}
