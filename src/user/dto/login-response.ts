import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @IsString()
  @ApiProperty()
  access_token: string;
}
