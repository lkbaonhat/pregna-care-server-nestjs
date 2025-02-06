import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { NormalizedResponse, Response } from 'src/types/core';

export class ResponseInterceptor<T>
  implements NestInterceptor<T, NormalizedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<NormalizedResponse<T>> {
    return next.handle().pipe(
      map((res: Response<T>) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          statusCode: context.switchToHttp().getResponse().statusCode,
          success: true,
          data: res.data,
          message: res.message,
        };
      }),
    );
  }
}
