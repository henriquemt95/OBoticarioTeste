import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseCreatedDto {
    @IsString()
    @ApiProperty()
    message: string;
  }