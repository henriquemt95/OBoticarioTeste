import {
  Controller,
  Post,
  Get,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { NewPurchaseDto } from './dto/new-purchase.dto';
import { PurchaseCreatedDto } from './dto/purchase-created-response';
import { isValidCPF, isValidDate } from '../utils/utils';
import { AuthGuard } from '../auth.guard';

@ApiTags('Purchases')
@Controller()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('/purchases')
  @ApiHeader({ name: 'authorization_token', required: true })
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Purchase created with success',
    type: PurchaseCreatedDto,
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
  @ApiBody({ type: NewPurchaseDto })
  @ApiOperation({
    summary: 'Endpoint para cadastro de compras realizadas',
    description: 'Endpoint para cadastro de compras realizadas',
  })
  async newPurchase(
    @Body() purchase: NewPurchaseDto,
  ): Promise<PurchaseCreatedDto> {
    if (!isValidCPF(purchase.cpf_user)) {
      throw new BadRequestException('CPF inválido');
    }

    if (!isValidDate(purchase.date)) {
      throw new BadRequestException(
        'Data inválida. A data informada deve estar no formato YYYY-MM-DD',
      );
    }

    try {
      await this.purchaseService.newPurchase(purchase);
      return {
        message: 'Compra criada com sucesso',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('/purchases')
  @ApiHeader({ name: 'authorization_token', required: true })
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Success',
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
    summary: 'Endpoint para listagem de compras realizadas',
    description: 'Endpoint para listagem de compras realizadas',
  })
  purchaseByAuthenticatedUser(): string {
    return this.purchaseService.purchaseByAuthenticatedUser();
  }
}
