import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionEntity } from './entities/option.entity';

import { OptionCreateDto } from './dto/option.create.dto';
import { OptionUpdateDto } from './dto/option.update.dto';

import { IPaginatedData } from '../../types/interface';
import { paginate } from '../../common';

@Injectable()
export class OptionsService {
  private readonly logger: Logger = new Logger(OptionsService.name);
  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
  ) {}

  async createOption(optionDto: OptionCreateDto): Promise<OptionEntity> {
    try {
      const option = this.optionRepository.create(optionDto);
      this.logger.log(`Successfully created option with ID: ${option.id}`);
      const savedOption = await this.optionRepository.save(option);

      return savedOption;
    } catch (error) {
      this.logger.error(`Error creating option: ${error.message}`);
      throw error;
    }
  }

  async updateOption(id: number, optionUpdateDto: OptionUpdateDto): Promise<OptionEntity> {
    const option = await this.optionRepository.findOne({ where: { id: id } });
    if (!option) {
      this.logger.warn(`Option not found with ID: ${id}`);
      throw new NotFoundException('Option not found');
    }
    const updatedStatus = { ...option, ...optionUpdateDto };
    return this.optionRepository.save(updatedStatus);
  }

  async deleteOption(id: number): Promise<void> {
    const result = await this.optionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    this.logger.log(`Successfully deleted Option with ID: ${id}`);
  }

  async getOptionById(id: number): Promise<OptionEntity> {
    const option = await this.optionRepository.findOne({ where: { id: id } });
    if (!option) {
      throw new NotFoundException('Status is not found');
    }
    return option;
  }

  async findAllOptions(page: number, limit: number): Promise<IPaginatedData<OptionEntity>> {
    const queryBuilder = this.optionRepository.createQueryBuilder('Options');
    return paginate<OptionEntity>(queryBuilder, +page, +limit);
  }
}
