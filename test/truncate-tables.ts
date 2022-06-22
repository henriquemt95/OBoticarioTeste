import { PrismaService } from '../src/ConfigModule/prisma.service';

export async function truncateTables(prismaService: PrismaService) {
  const transactions: any[] = [];
  transactions.push(prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  for (const {
    TABLE_NAME,
  } of await prismaService.$queryRaw<any>`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'security';`) {
    if (TABLE_NAME !== '_prisma_migrations') {
      try {
        transactions.push(
          prismaService.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`),
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prismaService.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }
}
