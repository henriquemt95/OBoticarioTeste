import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { enableSwaggerConfig } from './config/enableSwagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  enableSwaggerConfig(app);
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
  await app.listen(3000);
}
bootstrap();