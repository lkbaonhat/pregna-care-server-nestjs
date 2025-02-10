export interface Response<T = any> {
  data: T | null;
  message?: string | null;
}

export interface NormalizedResponse<T = any> extends Response<T> {
  statusCode: number;
  success: boolean;
}
