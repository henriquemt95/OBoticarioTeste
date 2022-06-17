import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreatedDto {
  @IsString()
  @ApiProperty()
  message: string;
}
