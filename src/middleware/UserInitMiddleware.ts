import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IRequest } from '../../custom';
import config from '../config';

@Injectable()
export class UserInitMiddleware implements NestMiddleware {
  use(req: IRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, config.secret) as {
        id: number;
        username: string;
      };
      req.info = { id: decoded.id, username: decoded.username };
    } catch (e) {}
    next();
  }
}
