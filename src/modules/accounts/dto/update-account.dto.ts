import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  order_id?: number;
}
