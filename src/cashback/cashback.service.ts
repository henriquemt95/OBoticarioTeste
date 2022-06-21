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

  async updateCashBackForAllPurchaseInCurrentMonth(
    month: number,
    year: number,
    currentPercentCashback: number,
    cpf_user: string,
  ): Promise<void> {
    await this.prismaService.$queryRaw`UPDATE Purchases 
      SET cashback = ${currentPercentCashback}
    WHERE MONTH(date) = ${month} AND YEAR(date) = ${year} and cpf_user = ${cpf_user}`;
  }

  async getCashbackPercentForUserAndMonthAndYear(
    month: number,
    year: number,
    currentValuePurchase: string,
    cpf_user: string,
  ): Promise<number> {
    let totalPurchaseValueForMonth = await this.prismaService
      .$queryRaw`SELECT SUM(value) as sumValue FROM Purchases 
    WHERE MONTH(date) = ${month} AND YEAR(date) = ${year} and cpf_user = ${cpf_user}`;

    totalPurchaseValueForMonth = totalPurchaseValueForMonth[0].sumValue ?? 0;

    let totalValuePurchaseForMonthRefreshed =
      Number(totalPurchaseValueForMonth) + Number(currentValuePurchase);

    const percentCashbackInCurrentMonth =
      this.getPercentCashbackForPurchaseValue(
        totalValuePurchaseForMonthRefreshed,
      );

    return percentCashbackInCurrentMonth;
  }

  getPercentCashbackForPurchaseValue(totalValuePurchase: number): number {
    if (totalValuePurchase <= 1000) {
      return 10;
    } else if (totalValuePurchase <= 1500) {
      return 15;
    } else {
      return 20;
    }
  }
}
