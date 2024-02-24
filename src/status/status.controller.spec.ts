// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusController } from './status.controller';

// describe('StatusController', () => {
// 	let controller: StatusController;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			controllers: [StatusController],
// 		}).compile();

// 		controller = module.get<StatusController>(StatusController);
// 	});

// 	it('should be defined', () => {
// 		expect(controller).toBeDefined();
// 	});
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


	
// 	// describe('findAllStatus', () => {
// 	// 	it('should return paginated data of statuses', async () => {
// 	// 		const page = 1;
// 	// 		const limit = 10;
// 	// 		const statuses = [{ id: 1, value: 'Active' }] as StatusEntity[];
// 	// 		const result = { data: statuses, total: 1, page, limit }; // Добавлены свойства page и limit

// 	// 		jest.spyOn(service, 'findAllStatus').mockResolvedValue(result);

// 	// 		const paginatedData = await controller.findAllStatus(page.toString(), limit.toString());
// 	// 		expect(paginatedData).toEqual(result);
// 	// 	});
// 	// });

// 	// Добавьте другие тесты для остальных методов контроллера
// });
import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { StatusEntity } from './entities/status.entity';
import { NotFoundException } from '@nestjs/common';

describe('StatusController', () => {
	let controller: StatusController;
	let service: StatusService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StatusController],
			providers: [StatusService],
		}).compile();

		controller = module.get<StatusController>(StatusController);
		service = module.get<StatusService>(StatusService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('createStatus', () => {
		it('should create a status', async () => {
			const statusCreateDto = { value: 'Active' };
			const createdStatus = { id: 1, value: 'Active' } as StatusEntity;

			jest.spyOn(service, 'createStatus').mockResolvedValue(createdStatus);

			expect(await controller.createStatus(statusCreateDto)).toBe(createdStatus);
		});

		it('should throw an error if creation fails', async () => {
			const statusCreateDto = { value: 'Active' };

			jest.spyOn(service, 'createStatus').mockRejectedValue(new Error());

			await expect(controller.createStatus(statusCreateDto)).rejects.toThrow();
		});
	});

	describe('deleteStatus', () => {
		it('should delete a status', async () => {
			const id = '1';
			jest.spyOn(service, 'deleteStatus').mockResolvedValue(undefined);

			await expect(controller.deleteStatus(id)).resolves.not.toThrow();
		});

		it('should throw NotFoundException if status is not found', async () => {
			const id = '1';
			jest.spyOn(service, 'deleteStatus').mockRejectedValue(new NotFoundException());

			await expect(controller.deleteStatus(id)).rejects.toThrowError(NotFoundException);
		});
	});

	describe('getStatusById', () => {
		it('should return a status by id', async () => {
			const id = '1';
			const status = { id: 1, value: 'Active' } as StatusEntity;
			jest.spyOn(service, 'getStatusById').mockResolvedValue(status);

			expect(await controller.getStatusById(id)).toEqual(status);
		});

		it('should throw NotFoundException if status is not found', async () => {
			const id = '1';
			jest.spyOn(service, 'getStatusById').mockRejectedValue(new NotFoundException());

			await expect(controller.getStatusById(id)).rejects.toThrowError(NotFoundException);
		});
	});

	// Добавьте другие тесты для остальных методов контроллера
});
