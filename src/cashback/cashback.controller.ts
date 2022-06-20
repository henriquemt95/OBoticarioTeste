import { CashbackService } from './cashback.service';
import {
  Controller,
  Headers,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { CashbackAccumulatedResponsetDto } from './dto/cashback-accumulated-response';
import { AuthGuard } from '../auth.guard';

@ApiTags('Cashback')
@Controller()
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}
  @Get('/cashback/accumulated')
  @ApiHeader({ name: 'authorization_token', required: true })
  @UseGuards(AuthGuard)
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
  @ApiOperation({
    summary: 'Rota para exibir o acumulado de cashback até o momento por cpf',
    description:
      'Rota para exibir o acumulado de cashback até o momento por cpf',
  })
  async getAccumulatedCashbackByAuthenticatedUser(
    @Headers() headers,
  ): Promise<CashbackAccumulatedResponsetDto> {
    try {
      const [, token] = headers.authorization_token.split(' ');
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
