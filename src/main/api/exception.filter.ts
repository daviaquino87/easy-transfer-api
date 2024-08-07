import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface IPrintError {
  ip: string;
  statusCode: number;
  method: string;
  url: string;
  body: any;
  stack?: any;
  error: any;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  private printError(error: IPrintError) {
    this.logger.error(error);
  }

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const ip = request?.ips?.length ? request.ips[0] : request.ip || null;
    const method = request?.method;
    const body = request?.body;
    const url = request?.url;

    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      const message = error?.message;

      this.printError({ ip, statusCode, method, url, body, error: message });

      return response.status(statusCode).json({
        message,
        error: error?.name,
        statusCode,
      });
    }

    this.printError({
      ip,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      method,
      url,
      body,
      error: error?.message,
      stack: error?.stack,
    });

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Ops! Erro interno no servidor.',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
