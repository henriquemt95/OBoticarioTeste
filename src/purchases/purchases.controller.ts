import {
  Controller,
  Post,
  Get,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Body,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NewPurchaseDto } from './dto/new-purchase.dto';
import { PurchaseCreatedDto } from './dto/purchase-created-response';

@ApiTags('Purchases')
@Controller()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post("/purchases")
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
    try {
      await this.purchaseService.newPurchase(purchase);
      return {
        message: 'Purchase created with success',
      };
    } catch (error) {}
  }

  @Get("/purchases")
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Success', //colocar type em todas as responses
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
