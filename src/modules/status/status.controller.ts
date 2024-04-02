import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { StatusCreateDto } from './dto/status.create.dto';
import { StatusUpdateDto } from './dto/status.update.dto';
import { StatusService } from './status.service';
import { StatusEntity } from './entities/status.entity';
import { IPaginatedData } from '../../types/interface';
import { ApiResponse } from '@nestjs/swagger';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post('create')
  async createStatus(@Body() statusData: StatusCreateDto): Promise<StatusEntity> {
    return await this.statusService.createStatus(statusData);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() updateStatusData: StatusUpdateDto): Promise<StatusEntity> {
    return this.statusService.updateStatus(+id, updateStatusData);
  }

  @Delete(':id')
  async deleteStatus(@Param('id') id: string): Promise<void> {
    await this.statusService.deleteStatus(+id);
  }

  @ApiResponse({ type: StatusEntity, isArray: true })
  @Get('all')
  async findAllStatus(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<IPaginatedData<StatusEntity>> {
    return this.statusService.findAllStatuses(+page, +limit);
  }

  @Get(':id')
  async getStatusById(@Param('id') statusId?: string): Promise<StatusEntity> {
    return this.statusService.getStatusById(+statusId);
  }
}
