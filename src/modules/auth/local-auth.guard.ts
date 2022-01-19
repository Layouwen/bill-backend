import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info, context, status) {
    if (status === 400) {
      const { body } = context.getRequest();
      const requireFields = {
        username: {
          statusCode: 101,
          message: '用户名不能为空',
        },
        password: {
          statusCode: 101,
          message: '密码不能为空',
        },
      };
      const keys = Object.keys(body);
      for (const field in requireFields) {
        if (!keys.includes(field) || !body[field]) {
          throw new HttpException(requireFields[field], 200);
        }
      }
    }
    if (err) throw err;
    // request add user field
    return user;
  }
}
