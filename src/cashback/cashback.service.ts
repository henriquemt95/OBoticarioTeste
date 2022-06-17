import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CashbackApiIntegration } from 'src/integration/cashback-api-boticario.integration';

@Injectable()
export class CashbackService {
  constructor(
    private prismaService: PrismaClient,
    private cashbackIntegration: CashbackApiIntegration,
  ) {}
  getCashbackByAuthenticatedUser(): string {
    return 'Hello World!';
  }

  async getAccumulatedCashbackByCpf(cpf: string): Promise<string> {
    const retorno = await this.cashbackIntegration.getCashBackByCpf(cpf);
    return retorno.data.body.credit;
  }
}
