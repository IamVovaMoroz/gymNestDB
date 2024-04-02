import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from './entities/account.entity';
import { IPaginatedData } from 'src/types/interface';
import { paginate } from '../../common';

@Injectable()
export class AccountsService {
  private readonly logger: Logger = new Logger(AccountsService.name);
  constructor(@InjectRepository(Accounts) private readonly accountRepository: Repository<Accounts>) {}

  async create(createAccountDto: CreateAccountDto) {
    const newAccounts = this.accountRepository.create(createAccountDto);
    await this.accountRepository.save(newAccounts);
    this.logger.log(`Acconunt created: ${newAccounts.id}`);
    return newAccounts;
  }

  async findAll(page: number, limit: number): Promise<IPaginatedData<Accounts>> {
    const queryBuilder = this.accountRepository.createQueryBuilder('Account');
    return paginate<Accounts>(queryBuilder, page, limit);
  }

  async findOne(id: number): Promise<Accounts> {
    const findAccount = await this.accountRepository.findOne({ where: { id } });
    if (!findAccount) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return findAccount;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Accounts> {
    const account = await this.findOne(id);
    if (!account) {
      this.logger.warn(`Account not found with ID: ${id}`);
      throw new NotFoundException('Account not found');
    }
    const updateAccount = { ...account, ...updateAccountDto };
    return await this.accountRepository.save(updateAccount);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.accountRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    this.logger.log(`Soft deleted Account with ID "${id}"`);
  }
}
