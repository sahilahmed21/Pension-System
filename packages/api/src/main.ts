import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Add this line to allow requests from our frontend
  app.enableCors();

  // Change the port to 3001 to avoid conflict with the frontend
  await app.listen(3001);
}
bootstrap();