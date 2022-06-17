import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewPurchaseDto } from './dto/new-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private prismaService: PrismaClient) {}
  async newPurchase(purchase: NewPurchaseDto): Promise<void> {
    await this.prismaService.purchases.create({ data: purchase });
    return;
  }

  purchaseByAuthenticatedUser(): string {
    return 'Hello World!';
  }
}
