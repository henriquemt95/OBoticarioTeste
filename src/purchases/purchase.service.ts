import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { formatDateForDatabase } from '../utils/utils';
import { STATUS_PURCHASE_APPROVED, STATUS_PURCHASE_IN_VALIDATION } from './constants/purchases.constants';
import { NewPurchaseDto } from './dto/new-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private prismaService: PrismaClient) {}
  async newPurchase(purchase: NewPurchaseDto): Promise<void> {
    let status = STATUS_PURCHASE_IN_VALIDATION;
    const user = await this.prismaService.user.findUnique({
      where: { cpf: purchase.cpf_user },
    });

    if (user.isAdmin) { // para o cpf 153.509.460-56 não ficar HardCode e sim parametrizável pelo banco!
      status = STATUS_PURCHASE_APPROVED;
    }
    purchase.date = formatDateForDatabase(purchase.date);
    purchase.status = status;
    await this.prismaService.purchases.create({ data: purchase });
    return;
  }

  purchaseByAuthenticatedUser(): string {
    return 'Hello World!';
  }
}
