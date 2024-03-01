import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { MockExpectedResultOfSubscription, mockUpdateSubscriptionDto } from '../common/constants';
import { SubscriptionCreateDto } from './dto/subscription.create.dto';

const mockPage = 1;
const mockLimit = 10;
const mockSubscriptionId = 1;

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let subscriptionRepository: Repository<SubscriptionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsService,
        {
          provide: getRepositoryToken(SubscriptionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    subscriptionRepository = module.get<Repository<SubscriptionEntity>>(getRepositoryToken(SubscriptionEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const mockDto: SubscriptionCreateDto = {

        description: 'example_description',
        freezing: true,
        price: 10.99,
        image: null,
        discount: false,
        discount_sum: new Date(),
        discount_date: new Date(),
        text: 'example_text',
        title: 'example_title',
        status_id: 1,

      };

      jest.spyOn(subscriptionRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(subscriptionRepository, 'create').mockReturnValueOnce(MockExpectedResultOfSubscription);
      jest.spyOn(subscriptionRepository, 'save').mockResolvedValueOnce(MockExpectedResultOfSubscription);

      // Call the method that should invoke subscriptionRepository.create
      await service.createSubscription(mockDto);

      // Check if subscriptionRepository.create was called with the expected arguments
      expect(subscriptionRepository.create).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('updateSubscription', () => {
    it('should update an existing subscription', async () => {
      const existingSubscription: SubscriptionEntity = {
        id: 1,
        description: 'Some description',
        price: 10.99,
        freezing: true,
        image: null,
        discount: false,
        discount_sum: new Date(),
        discount_date: new Date(),
        text: 'Some text',
        title: 'Some title',
        status_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        days_freezing: new Date(),
        expiration_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      };

      jest.spyOn(subscriptionRepository, 'findOne').mockResolvedValueOnce(existingSubscription);
      jest.spyOn(subscriptionRepository, 'save').mockResolvedValueOnce({ ...existingSubscription, ...mockUpdateSubscriptionDto });

      const result = await service.updateSubscription(mockSubscriptionId, mockUpdateSubscriptionDto);

      expect(result).toEqual({ ...existingSubscription, ...mockUpdateSubscriptionDto });
      expect(subscriptionRepository.findOne).toHaveBeenCalledWith({ where: { id: mockSubscriptionId } });
      expect(subscriptionRepository.save).toHaveBeenCalledWith({ ...existingSubscription, ...mockUpdateSubscriptionDto });
    });

    it('should throw NotFoundException if subscription does not exist', async () => {
      jest.spyOn(subscriptionRepository, 'findOne').mockResolvedValueOnce(null);
      const saveSpy = jest.spyOn(subscriptionRepository, 'save');

      await expect(service.updateSubscription(mockSubscriptionId, mockUpdateSubscriptionDto)).rejects.toThrow(NotFoundException);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteSubscription', () => {
    it('should delete an existing subscription', async () => {
      jest.spyOn(subscriptionRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await service.deleteSubscription(mockSubscriptionId);

      expect(subscriptionRepository.delete).toHaveBeenCalledWith(mockSubscriptionId);
    });

    it('should throw NotFoundException if subscription does not exist', async () => {
      jest.spyOn(subscriptionRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as DeleteResult);

      await expect(service.deleteSubscription(mockSubscriptionId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllSubscription', () => {
    it('should return paginated data of subscriptions', async () => {
      const mockData = [
        { id: 1, name: 'Subscription 1', description: 'Description 1', price: 10.99 },
        { id: 2, name: 'Subscription 2', description: 'Description 2', price: 20.99 },
      ];

      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([mockData, mockData.length]),
      } as unknown as SelectQueryBuilder<SubscriptionEntity>;

      jest.spyOn(subscriptionRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      const result = await service.findAllSubscription(mockPage, mockLimit);

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
      } as unknown as SelectQueryBuilder<SubscriptionEntity>;

      jest.spyOn(subscriptionRepository, 'createQueryBuilder').mockReturnValueOnce(queryBuilder);

      await expect(service.findAllSubscription(mockPage, mockLimit)).rejects.toThrow(NotFoundException);
    });
  });
  describe('getSubscriptionById', () => {
    it('should return subscription by id', async () => {
      const mockSubscription: SubscriptionEntity = {
        id: mockSubscriptionId,
        description: 'Test Subscription Description',
        freezing: true,
        price: 10.99,
        start_date: new Date(),
        end_date: new Date(),
        days_freezing: new Date(),
        image: null,
        expiration_at: null,
        discount: false,
        discount_sum: new Date(),
        discount_date: new Date(),
        text: 'Some text',
        title: 'Test Subscription',
        status_id: 1,
        updated_at: new Date(),
        deleted_at: null,
      };

      (jest.spyOn(subscriptionRepository, 'findOne') as jest.Mock).mockReturnValueOnce(mockSubscription);

      const result = await service.getSubscriptionById(mockSubscriptionId);

      expect(result).toEqual(mockSubscription);
      expect(subscriptionRepository.findOne).toHaveBeenCalledWith({ where: { id: mockSubscriptionId } });
    });

    it('should throw NotFoundException if subscription does not exist', async () => {
      (jest.spyOn(subscriptionRepository, 'findOne') as jest.Mock).mockReturnValueOnce(undefined);

      await expect(service.getSubscriptionById(mockSubscriptionId)).rejects.toThrow(NotFoundException);
    });
  });
});
