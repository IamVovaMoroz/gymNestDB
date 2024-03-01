import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { NotFoundException } from '@nestjs/common';
import { MockSubscriptionDto, mockUpdateSubscriptionDto } from '../common/constants';
import { PaginatedData } from '../types/interface';

const mockSubscriptionId = '1';
const mockSubscription = new SubscriptionEntity();

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let subscriptionsService: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {
            createSubscription: jest.fn(),
            updateSubscription: jest.fn(),
            deleteSubscription: jest.fn(),
            findAllSubscription: jest.fn(),
            getSubscriptionById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    subscriptionsService = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should return created Subscription', async () => {
      jest.spyOn(subscriptionsService, 'createSubscription').mockResolvedValueOnce(mockSubscription);

      const result = await controller.createSubscription(MockSubscriptionDto);

      expect(result).toEqual(mockSubscription);
      expect(subscriptionsService.createSubscription).toHaveBeenCalledWith(MockSubscriptionDto);
    });

    it('should throw NotFoundException if Subscription creation fails', async () => {
      jest.spyOn(subscriptionsService, 'createSubscription').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.createSubscription(MockSubscriptionDto)).rejects.toThrow(NotFoundException);
      expect(subscriptionsService.createSubscription).toHaveBeenCalledWith(MockSubscriptionDto);
    });
  });

  describe('updateSubscription', () => {
    it('should return updated subscription', async () => {
      const updatedSubscription = new SubscriptionEntity();
      updatedSubscription.id = 1;

      updatedSubscription.description = mockUpdateSubscriptionDto.description;

      jest.spyOn(subscriptionsService, 'updateSubscription').mockResolvedValueOnce(updatedSubscription);

      const result = await controller.updateSubscription(mockSubscriptionId, mockUpdateSubscriptionDto);

      expect(result.id).toEqual(updatedSubscription.id);
   
      expect(result.description).toEqual(updatedSubscription.description);
      expect(subscriptionsService.updateSubscription).toHaveBeenCalledWith(+mockSubscriptionId, mockUpdateSubscriptionDto);
    });

    it('should throw NotFoundException if subscription update fails', async () => {
      jest.spyOn(subscriptionsService, 'updateSubscription').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateSubscription(mockSubscriptionId, mockUpdateSubscriptionDto)).rejects.toThrow(NotFoundException);
      expect(subscriptionsService.updateSubscription).toHaveBeenCalledWith(+mockSubscriptionId, mockUpdateSubscriptionDto);
    });
  });

  describe('deleteSubscription', () => {
    it('should successfully delete the Subscription', async () => {
      await controller.deleteSubscription(mockSubscriptionId);
      expect(subscriptionsService.deleteSubscription).toHaveBeenCalledWith(+mockSubscriptionId);
    });

    it('should throw NotFoundException if Subscription does not exist', async () => {
      jest.spyOn(subscriptionsService, 'deleteSubscription').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteSubscription(mockSubscriptionId)).rejects.toThrow(NotFoundException);
      expect(subscriptionsService.deleteSubscription).toHaveBeenCalledWith(+mockSubscriptionId);
    });
  });

  describe('findAllSubscriptions', () => {
    it('should return paginated data of Subscriptions', async () => {
      const mockPage = '1';
      const mockLimit = '10';
      const mockResult: PaginatedData<SubscriptionEntity> = {
        data: [new SubscriptionEntity(), new SubscriptionEntity()],
        total: 2,
        page: 1,
        limit: 10,
      };

      jest.spyOn(subscriptionsService, 'findAllSubscription').mockResolvedValueOnce(mockResult);

      const result = await controller.findAllSubscription(mockPage, mockLimit);

      expect(result).toEqual(mockResult);
      expect(subscriptionsService.findAllSubscription).toHaveBeenCalledWith(+mockPage, +mockLimit);
    });
  });

  describe('getSubscriptionById', () => {
    it('should return Subscription by id', async () => {
      jest.spyOn(subscriptionsService, 'getSubscriptionById' as keyof SubscriptionsService).mockResolvedValueOnce(mockSubscription);

      const result = await controller.getSubscriptionById(mockSubscriptionId);

      expect(result).toEqual(mockSubscription);
      expect(subscriptionsService.getSubscriptionById).toHaveBeenCalledWith(+mockSubscriptionId);
    });

    it('should throw NotFoundException if Subscription not found', async () => {
      jest.spyOn(subscriptionsService, 'getSubscriptionById' as keyof SubscriptionsService).mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getSubscriptionById(mockSubscriptionId)).rejects.toThrow(NotFoundException);
      expect(subscriptionsService.getSubscriptionById).toHaveBeenCalledWith(+mockSubscriptionId);
    });
  });
});

