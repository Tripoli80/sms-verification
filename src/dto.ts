import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { IErrorResponse, IResponse } from './base/interfaces';
import { HttpStatus, Type, applyDecorators } from '@nestjs/common';

export class ErrorDto<T> implements IErrorResponse<T> {
  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  message?: string | string[];

  @ApiProperty()
  data?: T;
}

export class PaginatedDto<T> implements IResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  total: number;

  @ApiProperty({
    isArray: true,
  })
  data: T;
}

export class ResourceDto<T> implements IResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data?: T;
}

export const ApiModelResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Resource model',
      schema: {
        oneOf: [
          //{ $ref: getSchemaPath(ResourceDto) },
          {
            properties: {
              success: {
                type: 'boolean',
              },
              data: {
                type: 'object',
                $ref: getSchemaPath(model),
                //items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Paginated list',
      schema: {
        allOf: [
          //{ $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              success: {
                type: 'boolean',
              },
              total: {
                type: 'integer',
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiBaseRestResponse = () => {
  //const { withConflict, withValidation } = params
  return applyDecorators(
    ApiConflictResponse({
      status: HttpStatus.CONFLICT,
      description: 'Conflict',
      schema: {
        type: 'object',
        example: conflictError,
      },
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
      schema: {
        type: 'object',
        example: validationError,
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
      schema: {
        type: 'object',
        example: unauthorizedError,
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Forbidden',
      schema: {
        type: 'object',
        example: forbiddenError,
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Resource Not Found',
      schema: {
        type: 'object',
        example: notFoundError,
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        example: serverError,
      },
    }),
  );
};

export const validationError: IErrorResponse<any> = {
  statusCode: HttpStatus.BAD_REQUEST,
  message: ['[value] is not valid'],
};

export const conflictError = {
  statusCode: HttpStatus.CONFLICT,
  message: 'Resource with unique value (email, name etc) already exist',
};

export const serverError: IErrorResponse<any> = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'Sever error message',
};

export const successResponse: IResponse<any> = {
  success: true,
};

export const notFoundError: IErrorResponse<any> = {
  statusCode: HttpStatus.NOT_FOUND,
  message: 'Resource Not Found',
};

export const unauthorizedError: IErrorResponse<any> = {
  statusCode: HttpStatus.UNAUTHORIZED,
  message: 'Invalid signature | jwt must be provided',
};

export const forbiddenError: IErrorResponse<any> = {
  statusCode: HttpStatus.FORBIDDEN,
  message: 'Only [admin, user, vendor] has access',
};
