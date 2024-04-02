
import { IPaginatedData } from 'src/types/interface';
import { CreateAplicationDto } from '../../modules/aplications/dto/create-aplication.dto';
import { Aplications } from '../../modules/aplications/entities/aplication.entity';
import { UpdateAplicationDto } from '../../modules/aplications/dto/update-aplication.dto';

export const mockPage: number = 1;
export const mockLimit: number = 10;
export const mockAplicationId: number = 1;
export const mockCreateAplicationDto: CreateAplicationDto = {
  backend_version: '1.0.0',
  frontend_version: '1.0.0',
  name: 'Your App Name',
  image: 'http://example.com/your-image.jpg',
  description: 'Your app description',
  key: 'your_app_key',
  text: 'Additional text or details',
  licence_type: 'MIT License',
  type_id: 1,
};
export const mockCreatedAplication: Aplications = {
  id: 1,
  backend_version: '1.0.0',
  frontend_version: '1.0.0',
  name: 'Your App Name',
  image: 'http://example.com/your-image.jpg',
  description: 'Your app description',
  key: 'your_app_key',
  text: 'Additional text or details',
  licence_type: 'MIT License',
  type_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdatedAplication: Aplications = {
  id: 1,
  backend_version: '2.0.0',
  frontend_version: '2.0.0',
  name: 'Updated App Name',
  image: 'http://example.com/updated-image.jpg',
  description: 'Updated app description',
  key: 'updated_app_key',
  text: 'Updated additional text or details',
  licence_type: 'GPL',
  type_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockData: Aplications[] = [
  {
    id: 1,
    backend_version: '1.0.0',
    frontend_version: '1.0.0',
    name: 'Your App Name 1',
    image: 'http://example.com/your-image-1.jpg',
    description: 'Your app description 1',
    key: 'your_app_key_1',
    text: 'Additional text or details 1',
    licence_type: 'MIT',
    type_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
  {
    id: 2,
    backend_version: '1.0.0',
    frontend_version: '1.0.0',
    name: 'Your App Name 2',
    image: 'http://example.com/your-image-2.jpg',
    description: 'Your app description 2',
    key: 'your_app_key_2',
    text: 'Additional text or details 2',
    licence_type: 'MIT',
    type_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
export const mockUpdateAplicationDto: UpdateAplicationDto = {
  backend_version: '2.0.0',
  frontend_version: '2.0.0',
  name: 'Updated App Name',
  image: 'http://example.com/updated-image.jpg',
  description: 'Updated app description',
  text: 'Updated additional text or details',
  licence_type: 'GPL',
};
export const existingAplication: Aplications = {
  id: 1,
  backend_version: '1.0.0',
  frontend_version: '1.0.0',
  name: 'Your App Name',
  image: 'http://example.com/your-image.jpg',
  description: 'Your app description',
  key: 'your_app_key',
  text: 'Additional text or details',
  licence_type: 'MIT',
  type_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdateAplication: UpdateAplicationDto = {
  backend_version: '2.0.0',
  frontend_version: '2.0.0',
  name: 'Updated App Name',
  image: 'http://example.com/updated-image.jpg',
  description: 'Updated app description',
  text: 'Updated additional text or details',
  licence_type: 'GPL',
};
export const mockResult: IPaginatedData<Aplications> = {
  data: mockData,
  total: mockData.length,
  page: mockPage,
  limit: mockLimit,
};
export const mockFindAplication: Aplications = {
  id: 1,
  backend_version: '1.0.0',
  frontend_version: '1.0.0',
  name: 'Your App Name',
  image: 'http://example.com/your-image.jpg',
  description: 'Your app description',
  key: 'your_app_key',
  text: 'Additional text or details',
  licence_type: 'MIT',
  type_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
