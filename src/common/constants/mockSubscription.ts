import { SubscriptionEntity } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionUpdateDto } from 'src/subscriptions/dto/subscription.update.dto';
import { SubscriptionCreateDto } from 'src/subscriptions/dto/subscription.create.dto';

export const MockSubscriptionDto: SubscriptionCreateDto = {
  description: 'example description',
  freezing: false,
  price: 100,
  image: null,
  expiration_at: null,
  discount: true,
  discount_sum: null,
  discount_date: null,
  text: 'example text',
  title: 'example title',
  status_id: 1,
};

export const MockExpectedResultOfSubscription: SubscriptionEntity = {
  id: 1,
  ...MockSubscriptionDto,
  description: 'example description',
  freezing: false,
  price: 100,
  start_date: new Date(),
  end_date: new Date(),
  days_freezing: null,
  image: null,
  expiration_at: null,
  discount: true,
  discount_sum: new Date(),
  discount_date: new Date(),
  text: 'example text',
  title: 'example title',
  status_id: 1,
  updated_at: new Date(),
  deleted_at: null,
};

export const mockUpdateSubscriptionDto: SubscriptionUpdateDto = {
  description: 'New Description',
  freezing: false,
  price: 150,
  start_date: new Date(),
  end_date: new Date(),
  days_freezing: new Date(),
  image: 'new_image_url',
  expiration_at: new Date(),
  discount: true,
  discount_sum: new Date(),
  discount_date: new Date(),
  text: 'New Text',
  title: 'New Title',
  status_id: 2,
};
