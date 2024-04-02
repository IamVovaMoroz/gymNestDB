import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypesCreateDto } from './dto/type.create.dto';
import { TypesUpdateDto } from './dto/type.update.dto';
import { TypesEntity } from './entities/type.entity';
import { PaginatedData } from '../types/interface';
import { ApiResponse } from '@nestjs/swagger';

@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post('create')
  async createTypes(@Body() typeData: TypesCreateDto): Promise<TypesEntity> {
    return await this.typeService.createTypes(typeData);
  }

  @Patch(':id')
  async updateTypes(@Param('id') id: string, @Body() updateTypesData: TypesUpdateDto): Promise<TypesEntity> {
    return this.typeService.updateTypes(+id, updateTypesData);
  }

  @Delete(':id')
  async deleteTypes(@Param('id') id: string): Promise<void> {
    await this.typeService.deleteTypes(+id);
  }

  @ApiResponse({ type: TypesEntity, isArray: true })
  @Get('all')
  async findAllTypes(@Query('page') page: string, @Query('limit') limit: string): Promise<PaginatedData<TypesEntity>> {
    return this.typeService.findAllTypes(+page, +limit);
  }

  @Get(':id')
  async getTypesById(@Param('id') typeId?: string): Promise<TypesEntity> {
    return this.typeService.getTypesById(+typeId);
  }
}
