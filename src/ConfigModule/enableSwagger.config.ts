import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export const enableSwaggerConfig = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('O Boticário API')
    .setDescription('API para o gerenciamento de vendas e usuários O Boticário')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const yamlStr = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlStr, 'utf8');
  SwaggerModule.setup('api', app, document);
};
