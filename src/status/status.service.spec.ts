// import { Test, TestingModule } from '@nestjs/testing';
// import { StatusService } from './status.service';

// describe('StatusService', () => {
// 	let service: StatusService;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [StatusService],
// 		}).compile();

// 		service = module.get<StatusService>(StatusService);
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});
// });
import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { StatusEntity } from './entities/status.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { StatusModule } from './status.module';


describe('StatusService', () => {
	let service: StatusService;
	let repository: Repository<StatusEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [StatusModule],
			providers: [
				StatusService,
				{
					provide: getRepositoryToken(StatusEntity),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<StatusService>(StatusService);
		repository = module.get<Repository<StatusEntity>>(getRepositoryToken(StatusEntity));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('createStatus', () => {
		it('should create a status', async () => {
			const statusCreateDto = { value: 'Active' };
			const createdStatus = { id: 1, value: 'Active' } as StatusEntity;

			jest.spyOn(repository, 'create').mockReturnValue(createdStatus);
			jest.spyOn(repository, 'save').mockResolvedValue(createdStatus);

			expect(await service.createStatus(statusCreateDto)).toBe(createdStatus);
		});

		it('should throw an error if creation fails', async () => {
			const statusCreateDto = { value: 'Active' };

			jest.spyOn(repository, 'create').mockImplementation(() => { throw new Error(); });

			await expect(service.createStatus(statusCreateDto)).rejects.toThrow();
		});
	});

	describe('deleteStatus', () => {
		it('should delete a status', async () => {
			const id = 1;
			jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: null });

			await expect(service.deleteStatus(id)).resolves.not.toThrow();
		});

		it('should throw NotFoundException if status is not found', async () => {
			const id = 1;
			jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: null });

			await expect(service.deleteStatus(id)).rejects.toThrowError(NotFoundException);
		});
	});

	describe('getStatusById', () => {
		it('should return a status by id', async () => {
			const id = 1;
			const status = { id, value: 'Active' } as StatusEntity;
			jest.spyOn(repository, 'findOne').mockResolvedValue(status);

			expect(await service.getStatusById(id)).toEqual(status);
		});

		it('should throw NotFoundException if status is not found', async () => {
			const id = 1;
			jest.spyOn(repository, 'findOne').mockResolvedValue(null);

			await expect(service.getStatusById(id)).rejects.toThrowError(NotFoundException);
		});
	});

	describe('findAllStatuses', () => {
		it('should return paginated data of statuses', async () => {
			const page = 1;
			const limit = 10;
			const statuses = [{ id: 1, value: 'Active' }] as StatusEntity[];
			jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
				skip: jest.fn().mockReturnThis(),
				take: jest.fn().mockReturnThis(),
				getManyAndCount: jest.fn().mockResolvedValue([statuses, statuses.length]),
			} as any);

			const result = await service.findAllStatuses(page, limit);
			expect(result.data).toEqual(statuses);
			expect(result.total).toEqual(statuses.length);
		});
	});
});
