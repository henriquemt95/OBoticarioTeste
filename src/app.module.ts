import { Module } from '@nestjs/common';
import { CashbackController } from './cashback/cashback.controller';
import { CashbackService } from './cashback/cashback.service';
import { PurchaseService } from './purchases/purchase.service';
import { PurchaseController } from './purchases/purchases.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PrismaClient } from '@prisma/client';
import { CashbackApiIntegration } from './integration/cashback-api-boticario.integration';
import { HttpModule } from '@nestjs/axios';
import { AppConfigService } from './ConfigModule/service/app-config.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [UserController, CashbackController, PurchaseController],
  providers: [
    UserService,
    CashbackService,
    PurchaseService,
    PrismaClient,
    CashbackApiIntegration,
    AppConfigService,
    ConfigService,
  ],
})
export class AppModule {}
