import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CashbackAccumulatedRequestDto {
    @IsString()
    @ApiProperty()
    cpf: string;
  }