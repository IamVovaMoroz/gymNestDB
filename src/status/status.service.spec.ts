import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { StatusEntity } from './entities/status.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, DeleteResult } from 'typeorm';
import { mockUpdateStatusDto, MockExpectedResultOfStatus } from '../common/constants';
import { StatusCreateDto } from './dto/status.create.dto';

const mockPage = 1;
const mockLimit = 10;
const statusId = 1;

describe('StatusService', () => {
  let service: StatusService;
  let statusRepository: Repository<StatusEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: getRepositoryToken(StatusEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    statusRepository = module.get<Repository<StatusEntity>>(getRepositoryToken(StatusEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createStatus', () => {
    it('should create a new status', async () => {
      const mockDto: StatusCreateDto = {
        value: 'example_value4',
        visible: true,
      };

      jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(statusRepository, 'create').mockReturnValueOnce(MockExpectedResultOfStatus);
      jest.spyOn(statusRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfStatus);

      // Вызываем метод, который должен вызывать statusRepository.create
      await service.createStatus(mockDto);

      // Проверяем, был ли вызван statusRepository.create с ожидаемыми аргументами
      expect(statusRepository.create).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('updateStatus', () => {
    it('should update an existing status', async () => {
      const existingStatus = {
        id: statusId,
        value: 'Old Status',
        visible: true,
      };

      jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(existingStatus as StatusEntity);
      jest
        .spyOn(statusRepository, 'save')
        .mockResolvedValueOnce({ ...existingStatus, ...mockUpdateStatusDto } as StatusEntity);

      const result = await service.updateStatus(statusId, mockUpdateStatusDto);

      expect(result).toEqual({ ...existingStatus, ...mockUpdateStatusDto });
      expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
      expect(statusRepository.save).toHaveBeenCalledWith({ ...existingStatus, ...mockUpdateStatusDto });
    });

    it('should throw NotFoundException if status does not exist', async () => {
      jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateStatus(statusId, mockUpdateStatusDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteStatus', () => {
    it('should delete an existing status', async () => {
      jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await service.deleteStatus(statusId);

      expect(statusRepository.delete).toHaveBeenCalledWith(statusId);
    });

    it('should throw NotFoundException if status does not exist', async () => {
      jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as DeleteResult);

      await expect(service.deleteStatus(statusId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllStatuses', () => {
    it('should return paginated data of statuses', async () => {
      const mockData = [
        { id: 1, value: 'Status 1', visible: true },
        { id: 2, value: 'Status 2', visible: true },
      ];

      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<StatusEntity>;

      jest.spyOn(statusRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAllStatuses(mockPage, mockLimit);

      expect(result.data).toEqual(mockData);
      expect(result.total).toEqual(mockData.length);
      expect(result.page).toEqual(mockPage);
      expect(result.limit).toEqual(mockLimit);
    });

    it('should throw NotFoundException if no data found', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
      } as unknown as SelectQueryBuilder<StatusEntity>;

      jest.spyOn(statusRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAllStatuses(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatusById', () => {
    it('should return status by id', async () => {
      const mockStatus: StatusEntity = { id: statusId, value: 'Test Status', visible: true } as StatusEntity;

      jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(mockStatus);

      const result = await service.getStatusById(statusId);

      expect(result).toEqual(mockStatus);
      expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
    });

    it('should throw NotFoundException if status does not exist', async () => {
      jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.getStatusById(statusId)).rejects.toThrow(NotFoundException);
    });
  });
});
