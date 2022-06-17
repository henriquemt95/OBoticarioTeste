import { Module } from '@nestjs/common';
import { CashbackController } from './cashback/cashback.controller';
import { CashbackService } from './cashback/cashback.service';
import { PurchaseService } from './purchases/purchase.service';
import { PurchaseController } from './purchases/purchases.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CashbackApiIntegration } from './integration/cashback-api-boticario.integration';
import { HttpModule } from '@nestjs/axios';
import { AppConfigService } from './ConfigModule/service/app-config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [UserController, CashbackController, PurchaseController],
  providers: [
    UserService,
    CashbackService,
    PurchaseService,
    JwtService,
    PrismaClient,
    CashbackApiIntegration,
    AppConfigService,
    ConfigService,
  ],
})
export class AppModule {}
