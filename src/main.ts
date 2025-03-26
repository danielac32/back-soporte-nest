import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as cors from 'cors';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

async function bootstrap() {

  const corsOptions = {
    origin: ['http://localhost:4200','http://10.78.30.46:40001'], // Orígenes permitidos
    methods: ['GET', 'POST', 'PUT','DELETE','PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };

  const app = await NestFactory.create(AppModule);

  
  app.use(cors(corsOptions));
  const logger = new Logger('Bootstrap')
  //app.setGlobalPrefix('api');
 
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('RESTFull API')
    .setDescription('endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running in port ${ process.env.PORT }`)
}
bootstrap();
