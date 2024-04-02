import { IsNotEmpty, IsOptional, Length, IsDate, IsBoolean } from 'class-validator';

export class StatusCreateDto {
  @IsNotEmpty()
  @Length(1, 70)
  value?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;
}
