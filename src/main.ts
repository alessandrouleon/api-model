import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DomainExceptionFilter } from './@shared/domain/exception/exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Pipes e filtros
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
  app.useGlobalFilters(new DomainExceptionFilter());

  // CORS
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  const port = process.env.BACKEND_PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
