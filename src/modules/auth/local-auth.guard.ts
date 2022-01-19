import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorResponse } from '../../utils';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info, context, status) {
    if (status === 400) {
      const { body } = context.getRequest();
      const requireFields = {
        username: '请输入用户名',
        password: '请输入密码',
      };
      const keys = Object.keys(body);
      for (const field in requireFields) {
        if (!keys.includes(field)) {
          throw new ErrorResponse(requireFields[field]);
        }
      }
      throw new ErrorResponse('字段不能为空');
    }
    if (err) throw err;
    // request add user field
    return user;
  }
}
