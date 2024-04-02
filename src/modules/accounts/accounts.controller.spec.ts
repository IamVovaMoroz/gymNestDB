import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import {
  mockPage,
  mockLimit,
  mockAccountId,
  mockCreateAccountDto,
  mockCreatedAccount,
  mockUpdateAccountDto,
  mockUpdatedAccount,
  mockFindAccount,
  mockResult,
} from '../common/constants/mockAccounts';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        {
          provide: AccountsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('creates a new Account and returns the created Account with generated id', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockCreatedAccount);

      const result = await controller.create(mockCreateAccountDto);

      expect(result).toEqual(mockCreatedAccount);
      expect(service.create).toHaveBeenCalledWith(mockCreateAccountDto);
    });

    it('should throw NotFoundException if Account creation fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.create(mockCreateAccountDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(mockCreateAccountDto);
    });
  });

  describe('findAll', () => {
    it('should return  all Accounts', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockResult);

      const result = await controller.findAll(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });

    it('should throw NotFoundException if Accounts not found', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findAll(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
      expect(service.findAll).toHaveBeenCalledWith(mockPage, mockLimit);
    });
  });

  describe('findOne', () => {
    it('should return a single record by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockFindAccount);

      const result = await controller.findOne(mockAccountId);

      expect(result).toEqual(mockFindAccount);
      expect(service.findOne).toHaveBeenCalledWith(mockAccountId);
    });

    it('should throw NotFoundException if Account not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne(mockAccountId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(mockAccountId);
    });
  });

  describe('update', () => {
    it('should update the Account information', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(mockUpdatedAccount);

      const result = await controller.update(mockAccountId, mockUpdateAccountDto);

      expect(result).toEqual(mockUpdatedAccount);
      expect(service.update).toHaveBeenCalledWith(mockAccountId, mockUpdateAccountDto);
    });

    it('should throw NotFoundException if user update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update(mockAccountId, mockUpdateAccountDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(mockAccountId, mockUpdateAccountDto);
    });
  });

  describe('softDelete', () => {
    it('should soft remove an existing Account', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValueOnce();

      await controller.softDelete(mockAccountId);

      expect(service.softDelete).toHaveBeenCalledWith(mockAccountId);
    });

    it('should throw NotFoundException if Aplicaion does not exist', async () => {
      jest.spyOn(service, 'softDelete').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.softDelete(mockAccountId)).rejects.toThrow(NotFoundException);
      expect(service.softDelete).toHaveBeenCalledWith(mockAccountId);
    });
  });
});
