import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { AplicationsService } from './aplications.service';
import { CreateAplicationDto } from './dto/create-aplication.dto';
import { UpdateAplicationDto } from './dto/update-aplication.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Aplications } from './entities/aplication.entity';
import { IPaginatedData } from 'src/types/interface';

@Controller('aplications')
export class AplicationsController {
  constructor(private readonly aplicationsService: AplicationsService) {}

  @Post('create')
  async create(@Body() createAplicationDto: CreateAplicationDto) {
    return await this.aplicationsService.create(createAplicationDto);
  }

  @ApiResponse({ type: Aplications, isArray: true })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<IPaginatedData<Aplications>> {
    return await this.aplicationsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.aplicationsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAplicationDto: UpdateAplicationDto) {
    return await this.aplicationsService.update(id, updateAplicationDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.aplicationsService.softDelete(id);
  }
}
