import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypesEntity } from './entities/type.entity';
import { TypesUpdateDto } from './dto/type.update.dto';
import { TypesCreateDto } from './dto/type.create.dto';
import { IPaginatedData } from '../../types/interface';
import { paginate } from '../../common';

@Injectable()
export class TypeService {
  private readonly logger: Logger = new Logger(TypeService.name);
  constructor(
    @InjectRepository(TypesEntity)
    private readonly typesRepository: Repository<TypesEntity>,
  ) {}

  async createTypes(typesDto: TypesCreateDto): Promise<TypesEntity> {
    try {
      const types = this.typesRepository.create(typesDto);
      this.logger.log(`Successfully created Type with ID: ${types.id}`);
      const savedType = await this.typesRepository.save(types);

      return savedType;
    } catch (error) {
      this.logger.error(`Error creating Type: ${error.message}`);
      throw error;
    }
  }

  async updateTypes(id: number, typesUpdateDto: TypesUpdateDto): Promise<TypesEntity> {
    const type = await this.typesRepository.findOne({ where: { id: id } });
    if (!type) {
      this.logger.warn(`Type not found with ID: ${id}`);
      throw new NotFoundException('Status not found');
    }
    const updatedStatus = { ...type, ...typesUpdateDto };
    return this.typesRepository.save(updatedStatus);
  }

  async deleteTypes(id: number): Promise<void> {
    const result = await this.typesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Type with ID ${id} not found`);
    }
    this.logger.log(`Successfully deleted Type with ID: ${id}`);
  }

  async getTypesById(id: number): Promise<TypesEntity> {
    const types = await this.typesRepository.findOne({ where: { id: id } });
    if (!types) {
      throw new NotFoundException('Type is not found');
    }
    return types;
  }

  async findAllTypes(page: number, limit: number): Promise<IPaginatedData<TypesEntity>> {
    const queryBuilder = this.typesRepository.createQueryBuilder('Type');
    return paginate<TypesEntity>(queryBuilder, +page, +limit);
  }
}
