import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { StatusEntity } from './entities/status.entity';
import { NotFoundException } from '@nestjs/common';
import { mockUpdateStatusDto, MockStatusDto } from '../../common/constants';
import { IPaginatedData } from '../../types/interface';

const mockStatusId = '1';
const mockStatus: StatusEntity = new StatusEntity();

describe('StatusController', () => {
  let controller: StatusController;
  let statusService: StatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: {
            createStatus: jest.fn(),
            updateStatus: jest.fn(),
            deleteStatus: jest.fn(),
            findAllStatuses: jest.fn(),
            getStatusById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    statusService = module.get<StatusService>(StatusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStatus', () => {
    it('should return created Status', async () => {
      jest.spyOn(statusService, 'createStatus').mockResolvedValueOnce(mockStatus as StatusEntity);

      const result = await controller.createStatus(MockStatusDto);

      expect(result).toEqual(mockStatus);
      expect(statusService.createStatus).toHaveBeenCalledWith(MockStatusDto);
    });

    it('should throw NotFoundException if Status creation fails', async () => {
      jest.spyOn(statusService, 'createStatus').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.createStatus(MockStatusDto)).rejects.toThrow(NotFoundException);
      expect(statusService.createStatus).toHaveBeenCalledWith(MockStatusDto);
    });
  });

  describe('updateStatus', () => {
    it('should return updated status', async () => {
      const mockStatus = {
        id: 1,
        value: mockUpdateStatusDto.value,
        visible: mockUpdateStatusDto.visible,
        // created_at: new Date(),
        // updated_at: new Date(),
        // deleted_at: null,
      };

      jest.spyOn(statusService, 'updateStatus').mockResolvedValueOnce(mockStatus as StatusEntity);

      const result = await controller.updateStatus(mockStatusId, mockUpdateStatusDto);

      expect(result).toEqual(mockStatus);
      expect(statusService.updateStatus).toHaveBeenCalledWith(+mockStatusId, mockUpdateStatusDto);
    });

    it('should throw NotFoundException if status update fails', async () => {
      jest.spyOn(statusService, 'updateStatus').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateStatus(mockStatusId, mockUpdateStatusDto)).rejects.toThrow(NotFoundException);
      expect(statusService.updateStatus).toHaveBeenCalledWith(+mockStatusId, mockUpdateStatusDto);
    });
  });
  describe('deleteStatus', () => {
    it('should successfully delete the status', async () => {
      await controller.deleteStatus(mockStatusId);

      expect(statusService.deleteStatus).toHaveBeenCalledWith(+mockStatusId);
    });

    it('should throw NotFoundException if status does not exist', async () => {
      jest.spyOn(statusService, 'deleteStatus').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteStatus(mockStatusId)).rejects.toThrow(NotFoundException);
      expect(statusService.deleteStatus).toHaveBeenCalledWith(+mockStatusId);
    });
  });
  describe('findAllStatus', () => {
    it('should return paginated data of Statuses', async () => {
      const mockPage = '1';
      const mockLimit = '10';
      const mockResult: IPaginatedData<StatusEntity> = {
        data: [new StatusEntity(), new StatusEntity()],
        total: 2,
        page: 1,
        limit: 10,
      };

      jest.spyOn(statusService, 'findAllStatuses').mockResolvedValueOnce(mockResult);

      const result = await controller.findAllStatus(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(statusService.findAllStatuses).toHaveBeenCalledWith(+mockPage, +mockLimit);
    });
  });
  describe('getStatusById', () => {
    it('should return status by id', async () => {
      jest.spyOn(statusService, 'getStatusById').mockResolvedValueOnce(mockStatus);

      const result = await controller.getStatusById(mockStatusId);

      expect(result).toEqual(mockStatus);
      expect(statusService.getStatusById).toHaveBeenCalledWith(+mockStatusId);
    });

    it('should throw NotFoundException if status not found', async () => {
      jest.spyOn(statusService, 'getStatusById').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getStatusById(mockStatusId)).rejects.toThrow(NotFoundException);
      expect(statusService.getStatusById).toHaveBeenCalledWith(+mockStatusId);
    });
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusController } from './status.controller';
// import { StatusService } from './status.service';
// import { StatusEntity } from './entities/status.entity';
// import { NotFoundException } from '@nestjs/common';

// describe('StatusController', () => {
// 	let controller: StatusController;
// 	let service: StatusService;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			controllers: [StatusController],
// 			providers: [StatusService],
// 		}).compile();

// 		controller = module.get<StatusController>(StatusController);
// 		service = module.get<StatusService>(StatusService);
// 	});

// 	it('should be defined', () => {
// 		expect(controller).toBeDefined();
// 	});

// 	describe('createStatus', () => {
// 		it('should create a status', async () => {
// 			const statusCreateDto = { value: 'Active' };
// 			const createdStatus = { id: 1, value: 'Active' } as StatusEntity;

// 			jest.spyOn(service, 'createStatus').mockResolvedValue(createdStatus);

// 			expect(await controller.createStatus(statusCreateDto)).toBe(createdStatus);
// 		});

// 		it('should throw an error if creation fails', async () => {
// 			const statusCreateDto = { value: 'Active' };

// 			jest.spyOn(service, 'createStatus').mockRejectedValue(new Error());

// 			await expect(controller.createStatus(statusCreateDto)).rejects.toThrow();
// 		});
// 	});

// 	describe('deleteStatus', () => {
// 		it('should delete a status', async () => {
// 			const id = '1';
// 			jest.spyOn(service, 'deleteStatus').mockResolvedValue(undefined);

// 			await expect(controller.deleteStatus(id)).resolves.not.toThrow();
// 		});

// 		it('should throw NotFoundException if status is not found', async () => {
// 			const id = '1';
// 			jest.spyOn(service, 'deleteStatus').mockRejectedValue(new NotFoundException());

// 			await expect(controller.deleteStatus(id)).rejects.toThrowError(NotFoundException);
// 		});
// 	});

// 	describe('getStatusById', () => {
// 		it('should return a status by id', async () => {
// 			const id = '1';
// 			const status = { id: 1, value: 'Active' } as StatusEntity;
// 			jest.spyOn(service, 'getStatusById').mockResolvedValue(status);

// 			expect(await controller.getStatusById(id)).toEqual(status);
// 		});

// 		it('should throw NotFoundException if status is not found', async () => {
// 			const id = '1';
// 			jest.spyOn(service, 'getStatusById').mockRejectedValue(new NotFoundException());

// 			await expect(controller.getStatusById(id)).rejects.toThrowError(NotFoundException);
// 		});
// 	});

// 	// describe('findAllStatus', () => {
// 	// 	it('should return paginated data of statuses', async () => {
// 	// 		const page = 1;
// 	// 		const limit = 10;
// 	// 		const statuses = [{ id: 1, value: 'Active' }] as StatusEntity[];
// 	// 		const result = { data: statuses, total: 1, page, limit }; // Добавлены свойства page и limit

// 	// 		jest.spyOn(service, 'findAllStatus').mockResolvedValue(result);

// 	// 		const IPaginatedData = await controller.findAllStatus(page.toString(), limit.toString());
// 	// 		expect(IPaginatedData).toEqual(result);
// 	// 	});
// 	// });

// 	// Добавьте другие тесты для остальных методов контроллера
// });
// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusController } from './status.controller';
// import { StatusService } from './status.service';
// import { StatusEntity } from './entities/status.entity';
// import { NotFoundException } from '@nestjs/common';

// describe('StatusController', () => {
// 	let controller: StatusController;
// 	let service: StatusService;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			controllers: [StatusController],
// 			providers: [StatusService],
// 		}).compile();

// 		controller = module.get<StatusController>(StatusController);
// 		service = module.get<StatusService>(StatusService);
// 	});

// 	it('should be defined', () => {
// 		expect(controller).toBeDefined();
// 	});

// 	describe('createStatus', () => {
// 		it('should create a status', async () => {
// 			const statusCreateDto = { value: 'Active' };
// 			const createdStatus = { id: 1, value: 'Active' } as StatusEntity;

// 			jest.spyOn(service, 'createStatus').mockResolvedValue(createdStatus);

// 			expect(await controller.createStatus(statusCreateDto)).toBe(createdStatus);
// 		});

// 		it('should throw an error if creation fails', async () => {
// 			const statusCreateDto = { value: 'Active' };

// 			jest.spyOn(service, 'createStatus').mockRejectedValue(new Error());

// 			await expect(controller.createStatus(statusCreateDto)).rejects.toThrow();
// 		});
// 	});

// 	describe('deleteStatus', () => {
// 		it('should delete a status', async () => {
// 			const id = '1';
// 			jest.spyOn(service, 'deleteStatus').mockResolvedValue(undefined);

// 			await expect(controller.deleteStatus(id)).resolves.not.toThrow();
// 		});

// 		it('should throw NotFoundException if status is not found', async () => {
// 			const id = '1';
// 			jest.spyOn(service, 'deleteStatus').mockRejectedValue(new NotFoundException());

// 			await expect(controller.deleteStatus(id)).rejects.toThrowError(NotFoundException);
// 		});
// 	});

// 	describe('getStatusById', () => {
// 		it('should return a status by id', async () => {
// 			const id = '1';
// 			const status = { id: 1, value: 'Active' } as StatusEntity;
// 			jest.spyOn(service, 'getStatusById').mockResolvedValue(status);

// 			expect(await controller.getStatusById(id)).toEqual(status);
// 		});

// 		it('should throw NotFoundException if status is not found', async () => {
// 			const id = '1';
// 			jest.spyOn(service, 'getStatusById').mockRejectedValue(new NotFoundException());

// 			await expect(controller.getStatusById(id)).rejects.toThrowError(NotFoundException);
// 		});
// 	});

// 	// Добавьте другие тесты для остальных методов контроллера
// });
