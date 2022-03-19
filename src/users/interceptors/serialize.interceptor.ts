import {
  UseInterceptors,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Interface for any class

interface ClassConstructor {
  new (...args: any[]): {};
}

// Creating a custom decorator

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

//

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // Code to run for intercepting incoming requests

    return handler.handle().pipe(
      map((data: any) => {
        // code to run for intercepting outgoing response
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
