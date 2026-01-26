import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import cookie from '@fastify/cookie'


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.register(cookie);

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || true,
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}


bootstrap();
