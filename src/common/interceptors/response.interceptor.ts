import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class GlobalResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseDto<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        return new ResponseDto(data, 'Request successful', 'success');
      }),
      catchError((err) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (err instanceof HttpException) {
          status = err.getStatus();
          message = err.message || message;
        } else if (err?.message) {
          message = err.message;
        }

        response.status(status).json(new ResponseDto(null, message, 'error'));
        return throwError(() => err);
      }),
    );
  }
}
