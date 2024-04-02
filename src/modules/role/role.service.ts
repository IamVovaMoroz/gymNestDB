import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/role.entity';
import { paginate } from '../../common';
import { IPaginatedData } from 'src/types/interface';

@Injectable()
export class RoleService {
  private readonly logger: Logger = new Logger(RoleService.name);
  constructor(@InjectRepository(Roles) private readonly roleRepository: Repository<Roles>) {}

  async create(createRoleDto: CreateRoleDto) {
    const newRole = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(newRole);
    this.logger.log(`Role created: ${newRole.id}`);
    return newRole;
  }

  async findAll(page: number, limit: number): Promise<IPaginatedData<Roles>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('Role');
    return paginate<Roles>(queryBuilder, +page, +limit);
  }

  async findOne(id: number): Promise<Roles> {
    const findRole = await this.roleRepository.findOne({ where: { id } });
    if (!findRole) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return findRole;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Roles> {
    const role = await this.findOne(id);
    if (!role) {
      this.logger.warn(`Role not found with ID: ${id}`);
      throw new NotFoundException('Role not found');
    }
    const updateRole = { ...role, ...updateRoleDto };
    return await this.roleRepository.save(updateRole);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.roleRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    this.logger.log(`Soft deleted Role with ID "${id}"`);
  }
}
