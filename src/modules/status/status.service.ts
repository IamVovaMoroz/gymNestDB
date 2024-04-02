import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from './entities/status.entity';
import { StatusCreateDto } from './dto/status.create.dto';
import { StatusUpdateDto } from './dto/status.update.dto';
import { IPaginatedData } from '../../types/interface';
import { paginate } from '../../common';

@Injectable()
export class StatusService {
  private readonly logger: Logger = new Logger(StatusService.name);
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
  ) {}

  async createStatus(statusDto: StatusCreateDto): Promise<StatusEntity> {
    try {
      const status = this.statusRepository.create(statusDto);
      this.logger.log(`Successfully created status with ID: ${status.id}`);
      const savedStatus = await this.statusRepository.save(status);

      return savedStatus;
    } catch (error) {
      this.logger.error(`Error creating status: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(id: number, statusUpdateDto: StatusUpdateDto): Promise<StatusEntity> {
    const status = await this.statusRepository.findOne({ where: { id: id } });
    if (!status) {
      this.logger.warn(`Status not found with ID: ${id}`);
      throw new NotFoundException('Status not found');
    }
    const updatedStatus = { ...status, ...statusUpdateDto };
    return this.statusRepository.save(updatedStatus);
  }

  async deleteStatus(id: number): Promise<void> {
    const result = await this.statusRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }
    this.logger.log(`Successfully deleted status with ID: ${id}`);
  }

  async getStatusById(id: number): Promise<StatusEntity> {
    const status = await this.statusRepository.findOne({ where: { id: id } });
    if (!status) {
      throw new NotFoundException('Status is not found');
    }
    return status;
  }

  async findAllStatuses(page: number, limit: number): Promise<IPaginatedData<StatusEntity>> {
    const queryBuilder = this.statusRepository.createQueryBuilder('Status');
    return paginate<StatusEntity>(queryBuilder, +page, +limit);
  }
}
