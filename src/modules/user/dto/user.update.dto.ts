import { IsOptional, Length, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @Length(3, 70)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 70)
  last_name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 17)
  phone?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
