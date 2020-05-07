import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const handler = context.getClass().name + '.' + context.getHandler().name;
        this.logger.verbose(handler);

        const now = Date.now();
        return next.handle().pipe(tap(() => this.logger.verbose(handler + ' +' + `${Date.now() - now}ms`)));
    }
}
