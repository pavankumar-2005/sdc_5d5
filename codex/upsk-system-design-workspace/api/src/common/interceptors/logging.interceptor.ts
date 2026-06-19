import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

function sanitizeForLogs(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method } = req;
    const url = sanitizeForLogs(req.url);
    const start = Date.now();

    this.logger.log(`Request received: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const duration = Date.now() - start;
        this.logger.log(
          `Response sent: ${method} ${url} ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}
