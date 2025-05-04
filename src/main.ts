/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { INestApplication, Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');
const config = Config();
logger.log(`env: ${process.env.NODE_ENV}`);

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: config.logger.logLevels,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const port = config.port || 3000;
  app.enableCors({
    origin: `*`,
    credentials: true,
  });
  await app.listen(port);
  logger.log(`HTTP API Server started on port ${port}`);

  initialRabbitMQ(app);

  await app.startAllMicroservices();
  logger.log(`RabbitMQ microservice started`);
  logger.log(`App started on port ${port}`);
  logger.log(`App name: ${config.app.name}`);
  logger.log(`App version: ${config.app.version}`);
}
void bootstrap();

function initialRabbitMQ(app: INestApplication) {
  const rabbitConfig = config.rabbitmq;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: rabbitConfig,
  } as any);
  logger.log('Connected to rabbitMQ microservice');
}
