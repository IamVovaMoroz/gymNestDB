import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  title?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  image?: string;

  @IsNumber()
  price?: number;

  @IsNotEmpty()
  @IsNumber()
  counts?: number;

  @IsString()
  text?: string | null;
}
