
import { IPaginatedData } from 'src/types/interface';
import { Accounts } from '../../modules/accounts/entities/account.entity';
import { CreateAccountDto } from '../../modules/accounts/dto/create-account.dto';
import { UpdateAccountDto } from '../../modules/accounts/dto/update-account.dto';

export const mockPage: number = 1;
export const mockLimit: number = 10;
export const mockAccountId: number = 1;
export const mockCreateAccountDto: CreateAccountDto = {
  user_id: 123,
  balance: 100.0,
  order_id: 456,
};
export const mockCreatedAccount: Accounts = {
  id: 1,
  user_id: 123,
  balance: 100.0,
  order_id: 456,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdatedAccount: Accounts = {
  id: 1,
  user_id: 123,
  balance: 150.0,
  order_id: 456,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockData: Accounts[] = [
  {
    id: 1,
    user_id: 123,
    balance: 100.0,
    order_id: 12,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
  {
    id: 2,
    user_id: 456,
    balance: 200.0,
    order_id: 34,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
export const mockUpdateAccountDto: UpdateAccountDto = {
  balance: 150.0,
  order_id: 22,
};
export const existingAccount: Accounts = {
  id: 1,
  user_id: 123,
  balance: 100.0,
  order_id: 12,
  created_at: new Date('2022-01-01T00:00:00Z'),
  updated_at: new Date('2022-01-01T00:00:00Z'),
  deleted_at: null,
};
export const mockUpdateAccount: UpdateAccountDto = {
  user_id: 456,
  balance: 150.0,
  order_id: 24,
};
export const mockResult: IPaginatedData<Accounts> = {
  data: mockData,
  total: mockData.length,
  page: 1,
  limit: 10,
};
export const mockFindAccount: Accounts = {
  id: 1,
  user_id: 123,
  balance: 100.0,
  order_id: 12,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
