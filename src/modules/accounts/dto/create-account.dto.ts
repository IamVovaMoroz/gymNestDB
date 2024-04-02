import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsInt()
  order_id: number;
}
