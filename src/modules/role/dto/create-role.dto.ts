import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  value: string;

  @IsBoolean()
  visible: boolean = true;
}
