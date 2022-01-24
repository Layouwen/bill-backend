import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly service: UsersService) {}

  async use(req, res, next) {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const { username } = (await jwt.verify(token, config.secret)) as {
        username: string;
      };
      if (username) {
        req.userInfo = await this.service.findOne(username);
      }
      next();
    }
  }
}
