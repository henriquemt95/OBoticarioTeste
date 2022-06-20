import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPurchaseDto {
  @IsOptional()
  id?: number;

  @IsString()
  @ApiProperty()
  date: string;

  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  cpf_user: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsString()
  @IsOptional()
  status: string;
}
