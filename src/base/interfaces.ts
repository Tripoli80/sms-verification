export enum OrderType {
  ASC = 'asc',
  DESC = 'desc',
}

export interface IResponse<T> {
  success: boolean;
  data?: T | T[];
  total?: number;
}

export interface IErrorResponse<T> {
  statusCode?: number;
  message?: string | string[];
  data?: T;
}

export interface IRestBaseError {
  withConflict?: boolean;
  withValidation?: boolean;
}

export interface IErrorMessege {
  message: string;
  code?: number;
}

export interface IFindListOrder {
  limit?: number;
  offset?: number;
  orderType?: OrderType;
  [key: string]: any;
}
