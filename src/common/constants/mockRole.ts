import { CreateRoleDto } from 'src/modules/role/dto/create-role.dto';
import { UpdateRoleDto } from 'src/modules/role/dto/update-role.dto';
import { Roles } from 'src/modules/role/entities/role.entity';

export const mockPage: number = 1;
export const mockLimit: number = 10;
export const mockRoleId: number = 1;
export const createRoleDto: CreateRoleDto = {
  value: 'Test Role',
  visible: true,
};
export const mockUpdateRoleDto: UpdateRoleDto = {
  value: 'Test Role Update',
  visible: true,
};
export const existingRole: Roles = {
  id: 1,
  value: 'Test Role',
  visible: false,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdateRole: UpdateRoleDto = {
  value: 'Test Role',
  visible: true,
};
export const mockCreatedRole: Roles = {
  id: 1,
  value: 'Test Role',
  visible: true,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockData = [
  {
    id: 1,
    value: 'Test Role',
    visible: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
  {
    id: 2,
    value: 'Test Role 2',
    visible: false,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
export const findRole: Roles = {
  id: 1,
  value: 'test-value',
  visible: true,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdatedRole: Roles = {
  id: 1,
  value: 'test-value',
  visible: true,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
