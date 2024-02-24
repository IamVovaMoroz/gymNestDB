import { IsNotEmpty, IsEmail, IsOptional, Length, IsString, IsDate } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 70)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 70)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(3, 70)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 17)
  phone: string;

  @IsOptional()
  @IsDate()
  email_verified_at?: Date | null;

  @IsOptional()
  @IsDate()
  remember_token?: string | null;

  @IsOptional()
  @IsString()
  photo?: string;
}
