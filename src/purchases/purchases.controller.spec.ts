import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CashbackApiIntegration } from '../integration/cashback-api-boticario.integration';
import { PurchaseController } from './purchases.controller';
import { PurchaseService } from './purchase.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AppConfigService } from '../ConfigModule/service/app-config.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../ConfigModule/prisma.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { truncateTables } from '../../test/truncate-tables';
import { CashbackService } from '../cashback/cashback.service';

describe('PurchaseController', () => {
  let app: TestingModule;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PurchaseController, UserController],
      imports: [
        HttpModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '900s' },
        }),
      ],
      providers: [
        PurchaseService,
        PrismaClient,
        CashbackApiIntegration,
        AppConfigService,
        ConfigService,
        PrismaService,
        UserService,
        CashbackService,
      ],
    }).compile();

    prismaService = app.get<PrismaService>(PrismaService);
    await truncateTables(prismaService);

    await prismaService.user.create({
        data: {
          email: 'henriquetestes@gmail.com',
          name: 'henrique',
          cpf: '12820981607',
          password:
            '$2b$10$O5ZPAoMiPVFPyvShQDj3o.SO0I/uNhlqWMVgylBcFyppg8bV8p5aO',
        },
      });
  });

  afterAll(async () => {
    await truncateTables(prismaService);
    await app.close();
  });

  describe('accumulated cashback', () => {
    it('should not create new purchase with invalid cpf', async () => {
      const purchaseController =
        app.get<PurchaseController>(PurchaseController);

      const body = {
        date: '2022-06-22',
        code: '123455',
        cpf_user: '47331356615',
        value: '1',
        status: null,
        cashback: null,
      };

      let expectedReturn;
      try {
        expectedReturn = await purchaseController.newPurchase(body);
      } catch (error) {
        expectedReturn = error.message;
      }
      expect(expectedReturn).toBe(
        'O CPF do usuário informado na compra não foi encontrado!',
      );
    });

    it('should create new purchase with success', async () => {
      const purchaseController =
        app.get<PurchaseController>(PurchaseController);

      const body = {
        date: '2022-06-22',
        code: '123455',
        cpf_user: '12820981607',
        value: '1',
        status: null,
        cashback: null,
      };

      let expectedReturn;
      try {
        expectedReturn = await purchaseController.newPurchase(body);
      } catch (error) {
        expectedReturn = error.message;
      }
      expect(expectedReturn).toStrictEqual({
        message: 'Compra criada com sucesso',
      });
    });

    it('should return purchase for authenticated user with cashback information', async () => {
      const purchaseController =
        app.get<PurchaseController>(PurchaseController);

      const userController = app.get<UserController>(UserController);

      const { access_token } = await userController.login({
        email: 'henriquetestes@gmail.com',
        password: '0210',
      });
      const header = { authorization_token: `bearer ${access_token}` };

      let expectedReturn;
      try {
        expectedReturn = await purchaseController.purchaseByAuthenticatedUser(
          header,
        );
      } catch (error) {
        expectedReturn = error.message;
      }
      expect(expectedReturn).toStrictEqual([
        {
          code: '123455',
          percent_cashback: '10%',
          value: '1',
          value_cashback: 0.1,
          status: 'Em validação',
          date: '22/06/2022',
        },
      ]);
    });

    it('should not create new purchase with invalid cpf in body request', async () => {
      const purchaseController =
        app.get<PurchaseController>(PurchaseController);

      const body = {
        date: '2022-06-22',
        code: '123455',
        cpf_user: '12820981',
        value: '1',
        status: null,
        cashback: null,
      };

      let expectedReturn;
      try {
        expectedReturn = await purchaseController.newPurchase(body);
      } catch (error) {
        expectedReturn = error.message;
      }
      expect(expectedReturn).toBe('CPF inválido');
    });
  });
});
