import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from './entities/service.entity';
import { ApiResponse } from '@nestjs/swagger';
import { IPaginatedData } from 'src/types/interface';

@Controller('service')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('create')
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Services> {
    return await this.servicesService.create(createServiceDto);
  }

  @ApiResponse({ type: Services, isArray: true })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IPaginatedData<Services>> {
    return await this.servicesService.findAll(page, limit);
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.servicesService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicesService.softDelete(id);
  }
}
