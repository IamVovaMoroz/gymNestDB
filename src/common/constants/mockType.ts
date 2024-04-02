import { TypesEntity } from '../../type/entities/type.entity';
import { TypesUpdateDto } from '../../type/dto/type.update.dto';
import { TypesCreateDto } from '../../type/dto/type.create.dto';

export const MockTypeDto: TypesCreateDto = {
  value: 'example value 70',
  visible: true,
};

export const MockExpectedResultOfType: TypesEntity = {
  id: 1,
  ...MockTypeDto,
  visible: true,
  value: 'example value 70',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

export const mockUpdateTypeDto: TypesUpdateDto = {
  value: 'New Type Value 70',
  visible: false,
};
