import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IRequest } from '../../custom';

@Injectable()
export class UserInitMiddleware implements NestMiddleware {
  use(req: IRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      const { payload } = jwt.decode(token.replace('Bearer ', ''), {
        complete: true,
      });
      if (payload.id) {
        req.info = {
          id: payload.id,
          username: payload.username,
        };
      }
    }
    next();
  }
}
