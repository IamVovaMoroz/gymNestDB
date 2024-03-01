import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';


import { OptionCreateDto } from './dto/option.create.dto';

import { OptionUpdateDto } from './dto/option.update.dto';
import { OptionEntity } from './entities/option.entity';
import { OptionsService } from './options.service';
import { PaginatedData } from '../types/interface';
import { ApiResponse } from '@nestjs/swagger';

@Controller('options')
export class OptionsController {
	constructor(private readonly optionsService: OptionsService) { }

	@Post('create')
	async createOption(@Body() optionData: OptionCreateDto): Promise<OptionEntity> {
		return await this.optionsService.createOption(optionData);
	}

	@Patch(':id')
	async updateOption(
		@Param('id') id: string,
		@Body() updateOptionData: OptionUpdateDto,
	): Promise<OptionEntity> {
		return this.optionsService.updateOption(+id, updateOptionData);
	}

	@Delete(':id')
	async deleteOption(@Param('id') id: string): Promise<void> {
		await this.optionsService.deleteOption(+id);
	}

	@ApiResponse({ type: OptionEntity, isArray: true })
	@Get('all')
	async findAllOptions(
		@Query('page') page: string,
		@Query('limit') limit: string,
	): Promise<PaginatedData<OptionEntity>> {
		return this.optionsService.findAllOptions(+page, +limit);
	}

	@Get(':id')
	async getOptionById(@Param('id') optionId?: string): Promise<OptionEntity> {
		return this.optionsService.getOptionById(+optionId);
	}

}
