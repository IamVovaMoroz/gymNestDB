import { UserCreateDto } from '../../user/dto/user.create.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { UserUpdateDto } from '../../user/dto/user.update.dto';

export const MokUserDto: UserCreateDto = {
  email: 'test@example.com',
  password: 'password123',
  last_name: 'testName',
  first_name: 'testFirstName',
  phone: '324645675',
};

export const MockHashedPassword = 'hashedPassword123'; // Замените на фактическое захешированное значение пароля

export const MockExpectedResultOfUser: UserEntity = {
  id: 1,
  ...MokUserDto,
  password: MockHashedPassword,
  visible: true,
  email_verified_at: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  remember_token: null,
  photo: null,
};

export const mockUpdateUserDto: UserUpdateDto = {
  first_name: 'NewFirstName',
  last_name: 'NewLastName',
  phone: '123456789',
  photo: 'new-photo-url',
};
