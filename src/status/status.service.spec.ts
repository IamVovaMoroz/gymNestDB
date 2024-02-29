
// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusService } from './status.service';
// import { StatusEntity } from './entities/status.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository, SelectQueryBuilder, DeleteResult } from 'typeorm';
// import { mockUpdateStatusDto, MockStatusDto, MockExpectedResultOfStatus } from '../common/constants';
// import { StatusUpdateDto } from './dto/status.update.dto';

// // const mockField = 'value';
// // const mockValue = 'New Status';
// // const mockStatus = { id: 1, value: 'New Status' };
// const mockPage = 1;
// const mockLimit = 10;
// const statusId = 1;

// describe('StatusService', () => {
// 	let service: StatusService;
// 	let statusRepository: Repository<StatusEntity>;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [
// 				StatusService,
// 				{
// 					provide: getRepositoryToken(StatusEntity),
// 					useClass: Repository,
// 				},
// 			],
// 		}).compile();

// 		service = module.get<StatusService>(StatusService);
// 		statusRepository = module.get<Repository<StatusEntity>>(getRepositoryToken(StatusEntity));
// 	});

// 	afterEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});

// 	// describe('createStatus', () => {
// 	// 	it('should create a new status', async () => {
// 	// 		const mockDto = {
// 	// 			value: 'example_value4',
// 	// 			visible: true
// 	// 		};

// 	// 		jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);
// 	// 		jest.spyOn(statusRepository, 'create').mockReturnValueOnce(MockExpectedResultOfStatus);
// 	// 		jest.spyOn(statusRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfStatus);

// 	// 		// Добавляем console.log для отслеживания
// 	// 		console.log('MockStatusDto:', MockStatusDto);

// 	// 		const result = await service.createStatus(mockDto);

// 	// 		// Добавляем console.log для отслеживания
// 	// 		console.log('Result:', result);

// 	// 		expect(result).toEqual(MockExpectedResultOfStatus);
// 	// 		expect(statusRepository.create).toHaveBeenCalledWith(mockDto);
// 	// 		expect(statusRepository.save).toHaveBeenCalledWith(MockExpectedResultOfStatus);
// 	// 	});

// 	// 	it('should throw ConflictException if status with the same value already exists', async () => {
// 	// 		jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce({ id: 1, value: MockStatusDto.value } as StatusEntity);

// 	// 		await expect(service.createStatus(MockStatusDto)).rejects.toThrow(ConflictException);
// 	// 	});
// 	// });
// 	describe('createStatus', () => {
// 		it('should create a new status', async () => {
// 			const mockDto = {
// 				value: 'example_value4',
// 				visible: true
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);
// 			jest.spyOn(statusRepository, 'create').mockReturnValueOnce(MockExpectedResultOfStatus);
// 			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfStatus);

// 			// Добавляем console.log для отслеживания
// 			console.log('Mock DTO:', mockDto);

// 			try {
// 				console.log('Before creating status');
// 				const result = await service.createStatus(mockDto);
// 				console.log('After creating status. Result:', result);
// 			} catch (error) {
// 				console.error('Error occurred:', error);
// 			}

// 			expect(statusRepository.create).toHaveBeenCalledWith(mockDto);
// 			expect(statusRepository.save).toHaveBeenCalledWith(MockExpectedResultOfStatus);
// 		});

// 		it('should throw ConflictException if status with the same value already exists', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce({ id: 1, value: MockStatusDto.value } as StatusEntity);

// 			try {
// 				console.log('Before throwing ConflictException');
// 				await expect(service.createStatus(MockStatusDto)).rejects.toThrow(ConflictException);
// 				console.log('After throwing ConflictException');
// 			} catch (error) {
// 				console.error('Error occurred:', error);
// 			}
// 		});
// 	});



// 	describe('updateStatus', () => {
// 		it('should update an existing status', async () => {
// 			const existingStatus = {
// 				id: statusId,
// 				value: 'Old Status',
// 				visible: true,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(existingStatus as StatusEntity);
// 			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce({ ...existingStatus, ...mockUpdateStatusDto } as StatusEntity);

// 			const result = await service.updateStatus(statusId, mockUpdateStatusDto);

// 			expect(result).toEqual({ ...existingStatus, ...mockUpdateStatusDto });
// 			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
// 			expect(statusRepository.save).toHaveBeenCalledWith({ ...existingStatus, ...mockUpdateStatusDto });
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);

// 			await expect(service.updateStatus(statusId, mockUpdateStatusDto)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('deleteStatus', () => {
// 		it('should delete an existing status', async () => {
// 			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

// 			await service.deleteStatus(statusId);

// 			expect(statusRepository.delete).toHaveBeenCalledWith(statusId);
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as DeleteResult);

// 			await expect(service.deleteStatus(statusId)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('findAllStatuses', () => {
// 		it('should return paginated data of statuses', async () => {
// 			const mockData = [
// 				{ id: 1, value: 'Status 1', visible: true },
// 				{ id: 2, value: 'Status 2', visible: true },
// 			];

// 			const queryBuilder = {
// 				skip: jest.fn().mockReturnThis(),
// 				take: jest.fn().mockReturnThis(),
// 				getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
// 			} as unknown as SelectQueryBuilder<StatusEntity>;

// 			jest.spyOn(statusRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

// 			const result = await service.findAllStatuses(mockPage, mockLimit);

// 			expect(result.data).toEqual(mockData);
// 			expect(result.total).toEqual(mockData.length);
// 			expect(result.page).toEqual(mockPage);
// 			expect(result.limit).toEqual(mockLimit);
// 		});

// 		it('should throw NotFoundException if no data found', async () => {
// 			const queryBuilder = {
// 				skip: jest.fn().mockReturnThis(),
// 				take: jest.fn().mockReturnThis(),
// 				getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
// 			} as unknown as SelectQueryBuilder<StatusEntity>;

// 			jest.spyOn(statusRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

// 			await expect(service.findAllStatuses(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('getStatusById', () => {
// 		it('should return status by id', async () => {
// 			const mockStatus: StatusEntity = { id: statusId, value: 'Test Status', visible: true } as StatusEntity;

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(mockStatus);

// 			const result = await service.getStatusById(statusId);

// 			expect(result).toEqual(mockStatus);
// 			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(undefined);

// 			await expect(service.getStatusById(statusId)).rejects.toThrow(NotFoundException);
// 		});
// 	});
// });




// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusService } from './status.service';
// import { StatusEntity } from './entities/status.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// describe('StatusService', () => {
// 	let service: StatusService;
// 	let statusRepository: Repository<StatusEntity>;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [
// 				StatusService,
// 				{
// 					provide: getRepositoryToken(StatusEntity),
// 					useValue: {
// 						findOne: jest.fn(),
// 						create: jest.fn(),
// 						save: jest.fn(),
// 						delete: jest.fn(),
// 						findAndCount: jest.fn(),
// 					},
// 				},
// 			],
// 		}).compile();

// 		service = module.get<StatusService>(StatusService);
// 		statusRepository = module.get<Repository<StatusEntity>>(getRepositoryToken(StatusEntity));
// 	});

// 	afterEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	describe('createStatus', () => {
// 		it('should create a new status', async () => {
// 			// Arrange
// 			const mockDto = {
// 				value: 'example_value4',
// 				visible: true,
// 			};

// 			const mockCreatedStatus = {
// 				id: 1,
// 				value: 'example_value4',
// 				visible: true,
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 				deleted_at: null,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);
// 			jest.spyOn(statusRepository, 'create').mockReturnValueOnce(mockCreatedStatus);
// 			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce(mockCreatedStatus);

// 			// Act
// 			const result = await service.createStatus(mockDto);

// 			// Assert
// 			expect(result).toEqual(mockCreatedStatus);
// 			expect(statusRepository.create).toHaveBeenCalledWith(mockDto);
// 			expect(statusRepository.save).toHaveBeenCalledWith(mockCreatedStatus);
// 		});

// 		it('should throw ConflictException if status with the same value already exists', async () => {
// 			// Arrange
// 			const mockDto = {
// 				value: 'example_value4',
// 				visible: true,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce({ id: 1, value: mockDto.value } as StatusEntity);

// 			// Act & Assert
// 			await expect(service.createStatus(mockDto)).rejects.toThrow(ConflictException);
// 		});
// 	});

// 	describe('updateStatus', () => {
// 		it('should update an existing status', async () => {
// 			// Arrange
// 			const statusId = 1;
// 			const mockUpdateDto = {
// 				value: 'updated_value',
// 				visible: false,
// 			};
// 			const existingStatus = {
// 				id: statusId,
// 				value: 'existing_value',
// 				visible: true,
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 				deleted_at: null,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(existingStatus);
// 			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce({ ...existingStatus, ...mockUpdateDto });

// 			// Act
// 			const result = await service.updateStatus(statusId, mockUpdateDto);

// 			// Assert
// 			expect(result).toEqual({ ...existingStatus, ...mockUpdateDto });
// 			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
// 			expect(statusRepository.save).toHaveBeenCalledWith({ ...existingStatus, ...mockUpdateDto });
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			// Arrange
// 			const statusId = 1;
// 			const mockUpdateDto = {
// 				value: 'updated_value',
// 				visible: false,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);

// 			// Act & Assert
// 			await expect(service.updateStatus(statusId, mockUpdateDto)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('deleteStatus', () => {
// 		it('should delete an existing status', async () => {
// 			// Arrange
// 			const statusId = 1;
// 			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 1 });

// 			// Act
// 			await service.deleteStatus(statusId);

// 			// Assert
// 			expect(statusRepository.delete).toHaveBeenCalledWith(statusId);
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			// Arrange
// 			const statusId = 1;
// 			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 0 });

// 			// Act & Assert
// 			await expect(service.deleteStatus(statusId)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('findAllStatuses', () => {
// 		it('should return paginated data of statuses', async () => {
// 			// Arrange
// 			const mockPage = 1;
// 			const mockLimit = 10;
// 			const mockData = [
// 				{ id: 1, value: 'Status 1', visible: true },
// 				{ id: 2, value: 'Status 2', visible: true },
// 			];

// 			jest.spyOn(statusRepository, 'findAndCount').mockResolvedValueOnce([mockData, mockData.length]);

// 			// Act
// 			const result = await service.findAllStatuses(mockPage, mockLimit);

// 			// Assert
// 			expect(result.data).toEqual(mockData);
// 			expect(result.total).toEqual(mockData.length);
// 			expect(result.page).toEqual(mockPage);
// 			expect(result.limit).toEqual(mockLimit);
// 		});

// 		it('should throw NotFoundException if no data found', async () => {
// 			// Arrange
// 			const mockPage = 1;
// 			const mockLimit = 10;

// 			jest.spyOn(statusRepository, 'findAndCount').mockResolvedValueOnce([[], 0]);

// 			// Act & Assert
// 			await expect(service.findAllStatuses(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('getStatusById', () => {
// 		it('should return status by id', async () => {
// 			// Arrange
// 			const statusId = 1;
// 			const mockStatus: StatusEntity = {
// 				id: statusId,
// 				value: 'Test Status',
// 				visible: true,
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 				deleted_at: null,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(mockStatus);

// 			// Act
// 			const result = await service.getStatusById(statusId);

// 			// Assert
// 			expect(result).toEqual(mockStatus);
// 			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			// Arrange
// 			const statusId = 1;
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(undefined);

// 			// Act & Assert
// 			await expect(service.getStatusById(statusId)).rejects.toThrow(NotFoundException);
// 		});
// 	});
// });





import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { StatusEntity } from './entities/status.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('StatusService', () => {
	let service: StatusService;
	let statusRepository: Repository<StatusEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StatusService,
				{
					provide: getRepositoryToken(StatusEntity),
					useValue: {
						findOne: jest.fn(),
						create: jest.fn(),
						save: jest.fn(),
						delete: jest.fn(),
						findAndCount: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<StatusService>(StatusService);
		statusRepository = module.get<Repository<StatusEntity>>(getRepositoryToken(StatusEntity));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createStatus', () => {
		it('should create a new status', async () => {
			// Arrange
			const mockDto = {
				value: 'example_value4',
				visible: true,
			};

			const mockCreatedStatus = {
				id: 1,
				value: 'example_value4',
				visible: true,
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};

			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);
			jest.spyOn(statusRepository, 'create').mockReturnValueOnce(mockCreatedStatus);
			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce(mockCreatedStatus);

			// Act
			const result = await service.createStatus(mockDto);

			// Assert
			expect(result).toEqual(mockCreatedStatus);
			expect(statusRepository.create).toHaveBeenCalledWith(mockDto);
			expect(statusRepository.save).toHaveBeenCalledWith(mockCreatedStatus);
		});

		it('should throw ConflictException if status with the same value already exists', async () => {
			// Arrange
			const mockDto = {
				value: 'example_value4',
				visible: true,
			};

			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce({ id: 1, value: mockDto.value } as StatusEntity);

			// Act & Assert
			await expect(service.createStatus(mockDto)).rejects.toThrow(ConflictException);
		});
	});

	describe('updateStatus', () => {
		it('should update an existing status', async () => {
			// Arrange
			const statusId = 1;
			const mockUpdateDto = {
				value: 'updated_value',
				visible: false,
			};
			const existingStatus = {
				id: statusId,
				value: 'existing_value',
				visible: true,
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};

			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(existingStatus);
			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce({ ...existingStatus, ...mockUpdateDto });

			// Act
			const result = await service.updateStatus(statusId, mockUpdateDto);

			// Assert
			expect(result).toEqual({ ...existingStatus, ...mockUpdateDto });
			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
			expect(statusRepository.save).toHaveBeenCalledWith({ ...existingStatus, ...mockUpdateDto });
		});

		it('should throw NotFoundException if status does not exist', async () => {
			// Arrange
			const statusId = 1;
			const mockUpdateDto = {
				value: 'updated_value',
				visible: false,
			};

			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);

			// Act & Assert
			await expect(service.updateStatus(statusId, mockUpdateDto)).rejects.toThrow(NotFoundException);
		});
	});

	describe('deleteStatus', () => {
		it('should delete an existing status', async () => {
			// Arrange
			const statusId = 1;
			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 1, raw: {} as any });


			// Act
			await service.deleteStatus(statusId);

			// Assert
			expect(statusRepository.delete).toHaveBeenCalledWith(statusId);
		});

		it('should throw NotFoundException if status does not exist', async () => {
			// Arrange
			const statusId = 1;
			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 1, raw: {} as any });


			// Act & Assert
			await expect(service.deleteStatus(statusId)).rejects.toThrow(NotFoundException);
		});
	});

	describe('findAllStatuses', () => {
		it('should return paginated data of statuses', async () => {
			// Arrange
			const mockPage = 1;
			const mockLimit = 10;
			const mockData: StatusEntity[] = [
				{ id: 1, value: 'Status 1', visible: true, created_at: new Date(), updated_at: new Date(), deleted_at: null },
				{ id: 2, value: 'Status 2', visible: true, created_at: new Date(), updated_at: new Date(), deleted_at: null },
			];


			jest.spyOn(statusRepository, 'findAndCount').mockResolvedValueOnce([mockData, mockData.length]);

			// Act
			const result = await service.findAllStatuses(mockPage, mockLimit);

			// Assert
			expect(result.data).toEqual(mockData);
			expect(result.total).toEqual(mockData.length);
			expect(result.page).toEqual(mockPage);
			expect(result.limit).toEqual(mockLimit);
		});

		it('should throw NotFoundException if no data found', async () => {
			// Arrange
			const mockPage = 1;
			const mockLimit = 10;

			jest.spyOn(statusRepository, 'findAndCount').mockResolvedValueOnce([[], 0]);

			// Act & Assert
			await expect(service.findAllStatuses(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
		});
	});

	describe('getStatusById', () => {
		it('should return status by id', async () => {
			// Arrange
			const statusId = 1;
			const mockStatus: StatusEntity = {
				id: statusId,
				value: 'Test Status',
				visible: true,
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};

			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(mockStatus);

			// Act
			const result = await service.getStatusById(statusId);

			// Assert
			expect(result).toEqual(mockStatus);
			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
		});

		it('should throw NotFoundException if status does not exist', async () => {
			// Arrange
			const statusId = 1;
			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(undefined);

			// Act & Assert
			await expect(service.getStatusById(statusId)).rejects.toThrow(NotFoundException);
		});
	});
});





















// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusService } from './status.service';
// import { StatusEntity } from './entities/status.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository, SelectQueryBuilder, DeleteResult } from 'typeorm';
// import { StatusCreateDto } from './dto/status.create.dto';
// import { StatusUpdateDto } from './dto/status.update.dto';

// const mockPage = 1;
// const mockLimit = 10;
// const statusId = 1;

// describe('StatusService', () => {
// 	let service: StatusService;
// 	let statusRepository: Repository<StatusEntity>;

// 	const mockStatusDto: StatusCreateDto = {
// 		value: 'New Status',
// 		visible: true,
// 		// created_at: new Date(),
// 		// updated_at: new Date(),
// 		// deleted_at: null,
// 	};

// 	const mockUpdateStatusDto: StatusUpdateDto = {
// 		value: 'Updated Status',
// 		visible: false,
// 		updated_at: new Date(),
// 	};

// 	const mockExpectedStatus: StatusEntity = {
// 		id: statusId,
// 		value: 'New Status',
// 		visible: true,
// 		created_at: new Date(),
// 		updated_at: new Date(),
	
// 	};

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [
// 				StatusService,
// 				{
// 					provide: getRepositoryToken(StatusEntity),
// 					useClass: Repository,
// 				},
// 			],
// 		}).compile();

// 		service = module.get<StatusService>(StatusService);
// 		statusRepository = module.get<Repository<StatusEntity>>(
// 			getRepositoryToken(StatusEntity),
// 		);
// 	});

// 	afterEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});

// 	describe('createStatus', () => {
// 		it('should create a new status', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);
// 			jest.spyOn(statusRepository, 'create').mockReturnValueOnce(mockExpectedStatus);
// 			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce(mockExpectedStatus);

// 			const result = await service.createStatus(mockStatusDto);

// 			expect(result).toEqual(mockExpectedStatus);
// 			expect(statusRepository.create).toHaveBeenCalledWith(mockStatusDto);
// 			expect(statusRepository.save).toHaveBeenCalledWith(mockExpectedStatus);
// 		});

// 		it('should throw ConflictException if status with the same value already exists', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce({ id: 1, value: mockStatusDto.value } as StatusEntity);

// 			await expect(service.createStatus(mockStatusDto)).rejects.toThrow(ConflictException);
// 		});
// 	});

// 	describe('updateStatus', () => {
// 		it('should update an existing status', async () => {
// 			const existingStatus = {
// 				id: statusId,
// 				value: 'Old Status',
// 				visible: true,
// 			};

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(existingStatus as StatusEntity);
// 			jest.spyOn(statusRepository, 'save').mockResolvedValueOnce({ ...existingStatus, ...mockUpdateStatusDto } as StatusEntity);

// 			const result = await service.updateStatus(statusId, mockUpdateStatusDto);

// 			expect(result).toEqual({ ...existingStatus, ...mockUpdateStatusDto });
// 			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
// 			expect(statusRepository.save).toHaveBeenCalledWith({ ...existingStatus, ...mockUpdateStatusDto });
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(null);

// 			await expect(service.updateStatus(statusId, mockUpdateStatusDto)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('deleteStatus', () => {
// 		it('should delete an existing status', async () => {
// 			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

// 			await service.deleteStatus(statusId);

// 			expect(statusRepository.delete).toHaveBeenCalledWith(statusId);
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			jest.spyOn(statusRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as DeleteResult);

// 			await expect(service.deleteStatus(statusId)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('findAllStatuses', () => {
// 		it('should return paginated data of statuses', async () => {
// 			const mockData = [
// 				{ id: 1, value: 'Status 1', visible: true },
// 				{ id: 2, value: 'Status 2', visible: true },
// 			];

// 			const queryBuilder = {
// 				skip: jest.fn().mockReturnThis(),
// 				take: jest.fn().mockReturnThis(),
// 				getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
// 			} as unknown as SelectQueryBuilder<StatusEntity>;

// 			jest.spyOn(statusRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

// 			const result = await service.findAllStatuses(mockPage, mockLimit);

// 			expect(result.data).toEqual(mockData);
// 			expect(result.total).toEqual(mockData.length);
// 			expect(result.page).toEqual(mockPage);
// 			expect(result.limit).toEqual(mockLimit);
// 		});

// 		it('should throw NotFoundException if no data found', async () => {
// 			const queryBuilder = {
// 				skip: jest.fn().mockReturnThis(),
// 				take: jest.fn().mockReturnThis(),
// 				getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
// 			} as unknown as SelectQueryBuilder<StatusEntity>;

// 			jest.spyOn(statusRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

// 			await expect(service.findAllStatuses(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
// 		});
// 	});

// 	describe('getStatusById', () => {
// 		it('should return status by id', async () => {
// 			const mockStatus: StatusEntity = { id: statusId, value: 'Test Status', visible: true } as StatusEntity;

// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(mockStatus);

// 			const result = await service.getStatusById(statusId);

// 			expect(result).toEqual(mockStatus);
// 			expect(statusRepository.findOne).toHaveBeenCalledWith({ where: { id: statusId } });
// 		});

// 		it('should throw NotFoundException if status does not exist', async () => {
// 			jest.spyOn(statusRepository, 'findOne').mockResolvedValueOnce(undefined);

// 			await expect(service.getStatusById(statusId)).rejects.toThrow(NotFoundException);
// 		});
// 	});
// });

