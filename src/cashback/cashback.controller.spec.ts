import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CashbackApiIntegration } from '../integration/cashback-api-boticario.integration';
import { CashbackController } from './cashback.controller';
import { CashbackService } from './cashback.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AppConfigService } from '../ConfigModule/service/app-config.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../ConfigModule/prisma.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { truncateTables } from '../../test/truncate-tables';


describe('CashbackController', () => {
  let app: TestingModule;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CashbackController, UserController],
      imports: [
        HttpModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '900s' },
        }),
      ],
      providers: [
        CashbackService,
        PrismaClient,
        CashbackApiIntegration,
        AppConfigService,
        ConfigService,
        PrismaService,
        UserService,
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
    await app.close();
  });

  describe('accumulated cashback', () => {
    it('should return accumulated cashback with access token', async () => {
      const cashbackController =
        app.get<CashbackController>(CashbackController);

      const userController = app.get<UserController>(UserController);

      const { access_token } = await userController.login({
        email: 'henriqueteste@gmail.com',
        password: '0210',
      });
      const header = { authorization_token: `bearer ${access_token}` };

      expect(
        await cashbackController.getAccumulatedCashbackByAuthenticatedUser(
          header,
        ),
      ).toHaveProperty('message');
    });

    it('should not return accumulated cashback without access token by invalid user', async () => {
      const cashbackController =
        app.get<CashbackController>(CashbackController);

      const header = { authorization_token: `bearer ` };

      let expectedReturn;
      try {
        expectedReturn =
          await cashbackController.getAccumulatedCashbackByAuthenticatedUser(
            header,
          );
      } catch (error) {
        expectedReturn = error.message;
      }
      expect(expectedReturn).toBe("Cannot read property 'email' of null");
    });
  });
});
