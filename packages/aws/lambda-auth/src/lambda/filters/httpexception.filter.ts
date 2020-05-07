import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        this.logger.error(
            'Exception' +
                '\nName        : ' +
                exception.name +
                '\nMessage     : ' +
                exception.message +
                '\nResponse    : ' +
                JSON.stringify(exception.getResponse(), null, 2) +
                '\nStack Trace : ' +
                exception.stack,
        );
        const errResponse = exception.getResponse();
        if (typeof errResponse === 'object' && !Array.isArray(errResponse)) {
            const { statusCode, error, message } = errResponse as {
                statusCode: number;
                error: string;
                message: string[] | string;
            };
            response.status(status).json({
                statusCode: statusCode,
                error: error,
                message: Array.isArray(message) ? message : [message],
            });
        } else {
            response.status(status).json({
                statusCode: status,
                error: HttpStatus[status],
                message: Array.isArray(errResponse) ? errResponse : [errResponse],
            });
        }
    }
}
