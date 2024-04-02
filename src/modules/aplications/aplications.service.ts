import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateAplicationDto } from './dto/create-aplication.dto';
import { UpdateAplicationDto } from './dto/update-aplication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Aplications } from './entities/aplication.entity';
import { IPaginatedData } from '../../types/interface';
import { paginate } from '../../common';


@Injectable()
export class AplicationsService {
  private readonly logger: Logger = new Logger(AplicationsService.name);
  constructor(@InjectRepository(Aplications) private readonly aplicationRepository: Repository<Aplications>) {}

  async create(createAplicationDto: CreateAplicationDto) {
    const newAplication = this.aplicationRepository.create(createAplicationDto);
    await this.aplicationRepository.save(newAplication);
    this.logger.log(`Aplication created: ${newAplication.id}`);
    return newAplication;
  }

  async findAll(page: number, limit: number): Promise<IPaginatedData<Aplications>> {
    const queryBuilder = this.aplicationRepository.createQueryBuilder('Aplication');
    return paginate<Aplications>(queryBuilder, page, limit);
  }

  async findOne(id: number): Promise<Aplications> {
    const findAplication = await this.aplicationRepository.findOne({ where: { id } });
    if (!findAplication) {
      throw new NotFoundException(`Aplication with ID "${id}" not found`);
    }
    return findAplication;
  }

  async update(id: number, updateAplicationDto: UpdateAplicationDto): Promise<Aplications> {
    const aplication = await this.findOne(id);
    if (!aplication) {
      this.logger.warn(`Aplication not found with ID: ${id}`);
      throw new NotFoundException('Aplication not found');
    }
    const updateAplication = { ...aplication, ...updateAplicationDto };
    return await this.aplicationRepository.save(updateAplication);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.aplicationRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Aplication with ID "${id}" not found`);
    }
    this.logger.log(`Soft deleted Aplication with ID "${id}"`);
  }
}
