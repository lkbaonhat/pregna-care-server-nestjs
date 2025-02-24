import { Request } from 'express';
import { UserDocument } from 'src/users/user.schema';

export interface Response<T = any> {
  data: T | null;
  message?: string | null;
}

export interface NormalizedResponse<T = any> extends Response<T> {
  statusCode: number;
  success: boolean;
}

export interface AppRequest extends Request {
  user?: UserDocument;
}
