import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.enableCors(
    {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }
  );

  const port = process.env.PORT || 3000;


  await app.listen( port, '0.0.0.0');
}
bootstrap();
