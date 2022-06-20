import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CashbackApiIntegration } from 'src/integration/cashback-api-boticario.integration';

@Injectable()
export class CashbackService {
  constructor(
    private prismaService: PrismaClient,
    private cashbackIntegration: CashbackApiIntegration,
    private jwtService: JwtService,
  ) {}
  getCashbackByAuthenticatedUser(): string {
    return 'Hello World!';
  }

  async getAccumulatedCashbackByCpf(token: string): Promise<string> {
    const decodeToken = this.jwtService.decode(token);
    const user = await this.prismaService.user.findUnique({
      where: { email: decodeToken['email'] },
    });
    const retorno = await this.cashbackIntegration.getCashBackByCpf(user.cpf);
    return retorno.data.body.credit;
  }
}
