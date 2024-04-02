import { IsNotEmpty, IsOptional, Length, IsDate, IsBoolean, IsString, IsDefined } from 'class-validator';

export class OptionCreateDto {
  @IsBoolean()
  @IsOptional()
  autoload?: boolean;

  @IsString()
  @Length(1, 70)
  @IsNotEmpty()
  @IsDefined()
  key: string;

  @IsOptional()
  @IsString()
  value: string | null;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsDate()
  @IsDefined()
  created_at: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;
}
