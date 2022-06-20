import {
  Controller,
  Post,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request';
import { LoginResponseDto } from './dto/login-response';
import { UserDto } from './dto/user';
import { UserCreatedDto } from './dto/user-created-response';
import { UserService } from './user.service';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { isValidCPF } from 'src/utils/utils';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user/register')
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
  @ApiHeader({ name: 'token', required: true })
  @ApiBody({ type: UserDto })
  @ApiOperation({
    summary: 'Endpoint para cadastro de novo usuário',
    description: 'Endpoint para cadastro de novo usuário',
  })
  async register(@Body() user: UserDto): Promise<UserCreatedDto> {
    if (!isValidCPF(user.cpf)) {
      throw new BadRequestException('CPF inválido');
    }
    try {
      await this.userService.register(user);
      return {
        message: 'Usuário criado com sucesso',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('/user/login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login efetuado com sucesso',
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
  async login(@Body() user: LoginRequestDto): Promise<LoginResponseDto> {
    let idUser = null;
    try {
      idUser = await this.userService.validateUser(user.email, user.password);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (idUser) {
      return this.userService.login(user.email, idUser);
    }
    throw new UnauthorizedException('Usuário ou senha inválido(a)');
  }
}
