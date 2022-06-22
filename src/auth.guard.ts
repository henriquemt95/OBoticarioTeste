import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizationHeader = this.getAuthorizationHeader(context);
    if (!authorizationHeader) return false;

    const [, token] = authorizationHeader.split(' ');
    if (!token) return false;

    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getAuthorizationHeader(
    context: ExecutionContext,
  ): string | undefined {
    const getHeaderFns = {
      http: this.getHttpAuthorizationHeader,
    };
    const headerFn = getHeaderFns[context.getType()];
    if (!headerFn) return;
    return headerFn(context);
  }

  private getHttpAuthorizationHeader(
    context: ExecutionContext,
  ): string | undefined {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    return request.header('authorization_token');
  }
}
