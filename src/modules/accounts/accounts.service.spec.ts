import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountsService } from './accounts.service';
import { Accounts } from './entities/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockPage,
  mockLimit,
  mockAccountId,
  mockCreateAccountDto,
  mockCreatedAccount,
  mockData,
  mockUpdateAccountDto,
  existingAccount,
  mockUpdateAccount,
} from '../common/constants/mockAccounts';
import { NotFoundException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;
  let AccountRepository: Repository<Accounts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService, { provide: getRepositoryToken(Accounts), useClass: Repository }],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    AccountRepository = module.get<Repository<Accounts>>(getRepositoryToken(Accounts));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a new Account and returns the created Account with generated id', async () => {
      jest.spyOn(AccountRepository, 'create').mockReturnValueOnce(mockCreatedAccount);
      jest.spyOn(AccountRepository, 'save').mockResolvedValueOnce(mockCreatedAccount);

      const result = await service.create(mockCreateAccountDto);

      expect(result).toEqual(mockCreatedAccount);
      expect(AccountRepository.create).toHaveBeenCalledWith(mockCreateAccountDto);
      expect(AccountRepository.save).toHaveBeenCalledWith(mockCreatedAccount);
    });
  });

  describe('findAll', () => {
    it('should return  all Accounts', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<Accounts>;

      jest.spyOn(AccountRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAll(mockPage, mockLimit);

      expect(result.data).toEqual(mockData);
      expect(result.total).toEqual(mockData.length);
      expect(result.page).toEqual(mockPage);
      expect(result.limit).toEqual(mockLimit);
    });

    it('should return empty array if no data found', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as unknown as SelectQueryBuilder<Accounts>;

      jest.spyOn(AccountRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(AccountRepository, 'findOne').mockResolvedValueOnce(mockCreatedAccount);

      const result = await service.findOne(mockAccountId);

      expect(result).toEqual(mockCreatedAccount);
      expect(AccountRepository.findOne).toHaveBeenCalledWith({ where: { id: mockAccountId } });
    });

    it('should throw NotFoudExeption if Account is not found', async () => {
      jest.spyOn(AccountRepository, 'findOne').mockImplementation();

      await expect(service.findOne(mockAccountId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the Account information', async () => {
      const updateAccount = { ...existingAccount, ...mockUpdateAccountDto } as Accounts;

      jest.spyOn(AccountRepository, 'findOne').mockResolvedValueOnce(existingAccount);
      jest.spyOn(AccountRepository, 'save').mockResolvedValueOnce(updateAccount);

      const result = await service.update(mockAccountId, mockUpdateAccountDto);

      expect(result).toEqual(updateAccount);
      expect(AccountRepository.findOne).toHaveBeenCalledWith({ where: { id: mockAccountId } });
      expect(AccountRepository.save).toHaveBeenCalledWith(updateAccount);
    });

    it('should throw NotFoudExeption if Account does not  exist', async () => {
      jest.spyOn(AccountRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(mockAccountId, mockUpdateAccount)).rejects.toThrow(NotFoundException);
      expect(AccountRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockAccountId },
      });
    });

    describe('softDelete', () => {
      it('should soft remove an existing Account', async () => {
        jest.spyOn(AccountRepository, 'softDelete').mockResolvedValueOnce({ affected: 1 } as any);

        await service.softDelete(mockAccountId);

        expect(AccountRepository.softDelete).toHaveBeenCalledWith(mockAccountId);
      });

      it('should throw NotExeption if user does not exist', async () => {
        jest.spyOn(AccountRepository, 'softDelete').mockResolvedValueOnce({ affected: 0 } as any);

        await expect(service.softDelete(mockAccountId)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
