import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionCreateDto } from './dto/subscription.create.dto';
import { SubscriptionUpdateDto } from './dto/subscription.update.dto';
import { PaginatedData } from '../types/interface';
import { paginate } from '../common';

@Injectable()
export class SubscriptionsService {
  private readonly logger: Logger = new Logger(SubscriptionsService.name);
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async createSubscription(subscriptionDto: SubscriptionCreateDto): Promise<SubscriptionEntity> {
    try {
      const subscription = this.subscriptionRepository.create(subscriptionDto);
      this.logger.log(`Successfully created subscription with ID: ${subscription.id}`);
      const savedSubscription = await this.subscriptionRepository.save(subscription);

      return savedSubscription;
    } catch (error) {
      this.logger.error(`Error creating subscription: ${error.message}`);
      throw error;
    }
  }

  async updateSubscription(id: number, subscriptionUpdateDto: SubscriptionUpdateDto): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({ where: { id: id } });
    if (!subscription) {
      this.logger.warn(`Subscription not found with ID: ${id}`);
      throw new NotFoundException('Subscription not found');
    }
    const updatedSubscription = { ...subscription, ...subscriptionUpdateDto };
    return this.subscriptionRepository.save(updatedSubscription);
  }

  async deleteSubscription(id: number): Promise<void> {
    const result = await this.subscriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    this.logger.log(`Successfully soft-deleted subscription with ID: ${id}`);
  }

  async getSubscriptionById(id: number): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({ where: { id: id } });
    if (!subscription) {
      throw new NotFoundException('Subscription is not found');
    }
    return subscription;
  }

  async findAllSubscription(page: number, limit: number): Promise<PaginatedData<SubscriptionEntity>> {
    const queryBuilder = this.subscriptionRepository.createQueryBuilder('Subscription');
    return paginate<SubscriptionEntity>(queryBuilder, +page, +limit);
  }
}
