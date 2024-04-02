import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}
