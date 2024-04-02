import { IsNotEmpty, IsOptional, Length, IsDate, IsBoolean, IsString, IsDefined } from 'class-validator';

export class OptionUpdateDto {
  @IsBoolean()
  @IsOptional()
  @IsDefined() // not null
  autoload?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 70)
  @IsNotEmpty()
  @IsDefined()
  key?: string;

  @IsOptional()
  @IsString()
  value?: string | null;

  @IsOptional()
  @IsBoolean()
  @IsDefined()
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
