process.env.TZ = 'UTC';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// test rebuild caching 2
function getLogLevels(logLevel = 'info'): LogLevel[] {
  const levels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
  const normalized = logLevel.toLowerCase();
  const targetLevel = normalized === 'info' ? 'log' : normalized;
  const index = levels.indexOf(targetLevel as LogLevel);
  if (index === -1) {
    return ['log', 'warn', 'error', 'fatal'];
  }
  return [...levels.slice(0, index + 1), 'fatal'] as LogLevel[];
}

async function bootstrap() {
  dotenv.config();

  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Invalid PORT. Set PORT in .env (example: PORT=3000).');
  }

  const logLevels = getLogLevels(process.env.LOG_LEVEL);
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(port);
}
bootstrap();
