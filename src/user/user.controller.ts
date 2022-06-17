import {
  Controller,
  Post,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Body,
  Res,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request';
import { LoginResponseDto } from './dto/login-response';
import { UserDto } from './dto/user';
import { UserCreatedDto } from './dto/user-created-response';
import { UserService } from './user.service';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/user/register")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'User created with success',
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros inválidos',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro no servidor',
    type: InternalServerErrorException,
  })
  @ApiBody({ type: UserDto })
  @ApiOperation({
    summary: 'Endpoint para cadastro de novo usuário',
    description: 'Endpoint para cadastro de novo usuário',
  })
  async register(@Body() user: UserDto): Promise<UserCreatedDto> {
    try {
      await this.userService.register(user);
      return {
        message: 'User created with success',
      };
    } catch (error) {}
  }

  @Post("/user/login")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login success',
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros inválidos',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro no servidor',
    type: InternalServerErrorException,
  })
  @ApiOperation({
    summary: 'Endpoint para login de usuário',
    description: 'Endpoint para login de usuário',
  })
  @ApiBody({ type: LoginRequestDto })
  async login(@Body() user: UserDto): Promise<LoginResponseDto> {
    try {
      const idUser = await this.userService.validateUser(
        user.email,
        user.password,
      );
      if (idUser) {
        return this.userService.login(user.email, idUser);
      }
    } catch (error) {}
  }
}
