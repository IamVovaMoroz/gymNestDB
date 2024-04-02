import { PartialType } from '@nestjs/swagger';
import { CreateAplicationDto } from './create-aplication.dto';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAplicationDto extends PartialType(CreateAplicationDto) {
  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  backend_version?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  frontend_version?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(77)
  name?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  image?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  key?: string;

  @IsString()
  text?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  licence_type?: string;

  @IsNotEmpty()
  @IsInt()
  type_id?: number;
}
