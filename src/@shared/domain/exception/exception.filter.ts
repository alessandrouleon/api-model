
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import NotificationErros from '../notification/notification.error';

@Catch(NotificationErros)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: NotificationErros, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors: exception.errors,
        });
    }
}
