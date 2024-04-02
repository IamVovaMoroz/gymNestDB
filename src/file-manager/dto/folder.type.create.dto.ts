import { IsNotEmpty, IsEmail, IsOptional, Length, IsString, IsDate } from 'class-validator';

export class FolderTypeCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 70)
  folder_name: string;
}
