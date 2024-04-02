import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SubscriptionCreateDto } from './dto/subscription.create.dto';
import { SubscriptionUpdateDto } from './dto/subscription.update.dto';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { IPaginatedData } from '../../types/interface';
import { ApiResponse } from '@nestjs/swagger';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  async createSubscription(@Body() subscriptionData: SubscriptionCreateDto): Promise<SubscriptionEntity> {
    return await this.subscriptionsService.createSubscription(subscriptionData);
  }

  @Patch(':id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionData: SubscriptionUpdateDto,
  ): Promise<SubscriptionEntity> {
    return this.subscriptionsService.updateSubscription(+id, updateSubscriptionData);
  }

  @Delete(':id')
  async deleteSubscription(@Param('id') id: string): Promise<void> {
    await this.subscriptionsService.deleteSubscription(+id);
  }

  @ApiResponse({ type: SubscriptionEntity, isArray: true })
  @Get('all')
  async findAllSubscription(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<IPaginatedData<SubscriptionEntity>> {
    return this.subscriptionsService.findAllSubscription(+page, +limit);
  }

  @Get(':id')
  async getSubscriptionById(@Param('id') subscrId?: string): Promise<SubscriptionEntity> {
    return this.subscriptionsService.getSubscriptionById(+subscrId);
  }
}
