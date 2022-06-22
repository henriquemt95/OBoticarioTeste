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
        email: 'henriqueteste@gmail.com',
        name: 'henrique',
        cpf: '63787426000',
        password:
          '$2b$10$O5ZPAoMiPVFPyvShQDj3o.SO0I/uNhlqWMVgylBcFyppg8bV8p5aO',
      },
    });
  });

  afterAll(async () => {
    await truncateTables(prismaService);
    await prismaService.user.delete({
      where: {
        email: 'henriqueteste@gmail.com',
      },
    });

    await prismaService.purchases.deleteMany({
      where: {
        code: '123455',
      },
    });
    await app.close();
  });

  it('should not return accumulated cashback without access token by invalid user', async () => {
    const purchaseController = app.get<PurchaseController>(PurchaseController);

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
    expect(expectedReturn).toBe(
      'O CPF do usuário informado na compra não foi encontrado!',
    );
  });

  it('should not return accumulated cashback without access token by invalid user', async () => {
    const purchaseController = app.get<PurchaseController>(PurchaseController);

    const body = {
      date: '2022-06-22',
      code: '123455',
      cpf_user: '63787426000',
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

  describe('accumulated cashback', () => {
    it('should return accumulated cashback with access token', async () => {
      const purchaseController =
        app.get<PurchaseController>(PurchaseController);

      const userController = app.get<UserController>(UserController);

      const { access_token } = await userController.login({
        email: 'henriqueteste@gmail.com',
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
      console.log(JSON.stringify(expectedReturn));
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

    it('should not return accumulated cashback without access token by invalid user', async () => {
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
