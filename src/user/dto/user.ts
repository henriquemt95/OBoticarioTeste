import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  createdAt?: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  cpf: string;

  @IsString()
  @ApiProperty()
  password: string;
}
