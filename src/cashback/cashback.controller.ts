import { CashbackService } from './cashback.service';
import {
  Controller,
  Headers,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CashbackAccumulatedResponsetDto } from './dto/cashback-accumulated-response';

@ApiTags('Cashback')
@Controller()
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}
  @Get('/cashback/accumulated')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Seu cashback acumulado é de x reais',
    type: CashbackAccumulatedResponsetDto,
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
  @ApiOperation({
    summary: 'Rota para exibir o acumulado de cashback até o momento por cpf',
    description:
      'Rota para exibir o acumulado de cashback até o momento por cpf',
  })
  async getAccumulatedCashbackByAuthenticatedUser(
    @Headers() headers,
  ): Promise<CashbackAccumulatedResponsetDto> {
    try {
      const { token } = headers;
      const cashback = await this.cashbackService.getAccumulatedCashbackByCpf(
        token,
      );
      return {
        message: `Seu cashback acumulado é de ${cashback} reais`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
