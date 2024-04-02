import { IsNotEmpty, IsOptional, Length, IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class SubscriptionUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  @IsOptional()
  @IsBoolean()
  freezing: boolean;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;

  @IsOptional()
  @IsDate()
  days_freezing?: Date | null;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsDate()
  expiration_at?: Date | null;

  @IsOptional()
  @IsBoolean()
  discount?: boolean;

  @IsOptional()
  @IsDate()
  discount_sum?: Date;

  @IsOptional()
  @IsDate()
  discount_date?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsNumber()
  status_id: number;
}
