import { CreateServiceDto } from 'src/modules/services/dto/create-service.dto';
import { UpdateServiceDto } from 'src/modules/services/dto/update-service.dto';
import { Services } from 'src/modules/services/entities/service.entity';

export const mockPage: number = 1;
export const mockLimit: number = 10;
export const mockServiceId: number = 1;
export const createServiceDto: CreateServiceDto = {
  title: 'Test Service',
  description: 'Test Service',
  image: 'http://',
  price: 100,
  counts: 50,
  text: 'Test Service',
};
export const createdService: Services = {
  id: 1,
  title: 'Test Service',
  description: 'Test Service',
  image: 'http://',
  price: 100,
  counts: 50,
  text: 'Test Service',
  start_date: new Date(),
  end_date: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdateServiceDto: UpdateServiceDto = {
  title: 'Updated Test Service 1',
  description: 'Updated Test Service Description  1',
  image: 'http://Update',
  price: 999,
  counts: 48,
  text: 'Updated Text of Service  1',
};
export const mockUpdatedService: Services = {
  id: 1,
  title: 'Updated Test Service 1',
  description: 'Updated Test Service Description  1',
  image: 'http://Update',
  price: 999,
  counts: 48,
  text: 'Updated Text of Service  1',
  start_date: new Date(),
  end_date: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockService: Services = {
  id: 1,
  title: 'Test Service 1',
  description: 'Test Service 1',
  image: 'http://1',
  price: 100,
  counts: 50,
  text: 'Test Service 1',
  start_date: new Date(),
  end_date: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockData = [
  {
    id: 1,
    title: 'Test Service 1',
    description: 'Test Service 1',
    image: 'http://1',
    price: 100,
    counts: 50,
    text: 'Test Service 1',
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
  {
    id: 2,
    title: 'Test Service 2',
    description: 'Test Service 2',
    image: 'http://2',
    price: 100,
    counts: 50,
    text: 'Test Service 2',
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
export const existingService: Services = {
  id: 1,
  title: 'Test Service 1',
  description: 'Test Service 1',
  image: 'http://1',
  price: 100,
  counts: 50,
  text: 'Test Service 1',
  start_date: new Date(),
  end_date: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
export const mockUpdateService: UpdateServiceDto = {
  title: 'Updated Test Service 1',
  description: 'Updated Test Service Description  1',
  image: 'http://Update',
  price: 999,
  counts: 48,
  text: 'Updated Text of Service  1',
};
