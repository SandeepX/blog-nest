import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          if (err.constraints) {
            return Object.values(err.constraints).join(', ');
          }
          return '';
        });
        return new BadRequestException(messages);
      },
    }),
  );

  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  const port = process.env.PORT ?? 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: http://0.0.0.0:${port}`);
}

bootstrap();
