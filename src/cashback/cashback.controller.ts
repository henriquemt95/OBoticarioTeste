import { CashbackService } from './cashback.service';
import {
  Controller,
  Post,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CashbackAccumulatedRequestDto } from './dto/cashback-accumulated-request';
import { isValidCPF } from 'src/utils/utils';

@ApiTags('Cashback')
@Controller()
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}
  @Get('/cashback/accumulated/:cpf')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
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
  @ApiParam({ name: 'cpf' })
  @ApiOperation({
    summary: 'Rota para exibir o acumulado de cashback até o momento por cpf',
    description: 'Rota para exibir o acumulado de cashback até o momento por cpf',
  })
  async getAccumulatedCashbackByAuthenticatedUser(
    @Param() paramPath: CashbackAccumulatedRequestDto,
  ): Promise<string> {
    try {
      const { cpf } = paramPath;
      if (!isValidCPF(cpf)) {
        throw new Error('CPF inválido!');
      }
      return this.cashbackService.getAccumulatedCashbackByCpf(cpf);
    } catch (error) {
      console.log(error);
    }
  }
}
