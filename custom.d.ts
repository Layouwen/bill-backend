import { Request } from 'express';

export interface IRequest extends Request {
  info?: {
    id: number;
    username: string;
  };
}
