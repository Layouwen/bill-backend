import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        message: 'token expired',
        statusCode: '403',
      });
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException({
        message: 'token error',
        statusCode: '402',
      });
    }
    if (!user) {
      throw new UnauthorizedException({
        message: 'token is require',
        statusCode: '401',
      });
    }
    // request add user field
    return user;
  }
}
