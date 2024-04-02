import { StatusCreateDto } from '../../status/dto/status.create.dto';
import { StatusEntity } from '../../status/entities/status.entity';
import { StatusUpdateDto } from '../../status/dto/status.update.dto';

export const MockStatusDto: StatusCreateDto = {
  value: 'example value 70',
  visible: true,
};

export const MockExpectedResultOfStatus: StatusEntity = {
  id: 1,
  ...MockStatusDto,
  visible: true,
  value: 'example value 70',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

export const mockUpdateStatusDto: StatusUpdateDto = {
  value: 'New Status Value 70',
  visible: false,
};
