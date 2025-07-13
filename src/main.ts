import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/middleware/exception-handler.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configure validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
