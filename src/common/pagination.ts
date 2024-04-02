import { SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { IPaginatedData } from 'src/types/interface';

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number,
  limit: number,
): Promise<IPaginatedData<T>> {
  const skip = (page - 1) * limit;
  const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

  if (!data.length) {
    throw new NotFoundException('No data found');
  }

  return { data, total, page, limit };
}
