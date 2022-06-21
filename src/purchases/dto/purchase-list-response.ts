import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseResponse {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsString()
  @ApiProperty()
  date: string;

  @IsString()
  @ApiProperty()
  percent_cashback: string;

  @IsNumber()
  @ApiProperty()
  value_cashback: number;

  @IsString()
  @IsOptional()
  status: string;
}
