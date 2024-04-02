import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from './entities/service.entity';
import { IPaginatedData } from 'src/types/interface';
import { paginate } from '../../common';

@Injectable()
export class ServicesService {
  private readonly logger: Logger = new Logger(ServicesService.name);
  constructor(@InjectRepository(Services) private readonly serviceRepository: Repository<Services>) {}

  async create(serviceDto: CreateServiceDto): Promise<Services> {
    const newService = this.serviceRepository.create(serviceDto);
    await this.serviceRepository.save(newService);
    this.logger.log(`Service created: ${newService.id}`);
    return newService;
  }

  async findAll(page: number, limit: number): Promise<IPaginatedData<Services>> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('Service');
    return paginate<Services>(queryBuilder, page, limit);
  }

  async findOneById(id: number): Promise<Services> {
    const foundService = await this.serviceRepository.findOne({ where: { id } });
    if (!foundService) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return foundService;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Services> {
    const service = await this.findOneById(id);
    if (!service) {
      this.logger.warn(`Service not found with ID: ${id}`);
      throw new NotFoundException('Service not found');
    }
    const updateService = { ...service, ...updateServiceDto };
    return await this.serviceRepository.save(updateService);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.serviceRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    this.logger.log(`Soft deleted Service with ID "${id}"`);
  }
}
