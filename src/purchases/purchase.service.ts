import { Injectable } from '@nestjs/common';
import { PrismaClient, Purchases } from '@prisma/client';
import { formatDateForDatabase } from '../utils/utils';
import {
  STATUS_PURCHASE_APPROVED,
  STATUS_PURCHASE_IN_VALIDATION,
} from './constants/purchases.constants';
import { NewPurchaseDto } from './dto/new-purchase.dto';
import * as moment from 'moment';
import { CashbackService } from '../cashback/cashback.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PurchaseService {
  constructor(
    private prismaService: PrismaClient,
    private cashbackService: CashbackService,
    private jwtService: JwtService,
  ) {}
  async newPurchase(purchase: NewPurchaseDto): Promise<void> {
    let status = STATUS_PURCHASE_IN_VALIDATION;
    const user = await this.prismaService.user.findUnique({
      where: { cpf: purchase.cpf_user },
    });

    if(!user){
      throw new Error("O CPF do usuário informado na compra não foi encontrado!")
    }

    if (user.isAdmin) {
      // para o cpf 153.509.460-56 não ficar HardCode e sim parametrizável pelo banco!
      status = STATUS_PURCHASE_APPROVED;
    }

    const month = moment(purchase.date).month() + 1;
    const year = moment(purchase.date).year();
    purchase.date = formatDateForDatabase(purchase.date);

    purchase.status = status;
    purchase.cashback =
      await this.cashbackService.getCashbackPercentForUserAndMonthAndYear(
        month,
        year,
        purchase.value,
        purchase.cpf_user,
      );
    await this.prismaService.purchases.create({ data: purchase });
    await this.cashbackService.updateCashBackForAllPurchaseInCurrentMonth(
      month,
      year,
      purchase.cashback,
      purchase.cpf_user,
    );
    return;
  }

  async purchaseByAuthenticatedUser(token: string): Promise<Purchases[]> {
    const decodeToken = this.jwtService.decode(token);
    const user = await this.prismaService.user.findUnique({
      where: { email: decodeToken['email'] },
    });
    return await this.prismaService.purchases.findMany({
      where: {
        cpf_user: user.cpf,
      },
    });
  }
}
