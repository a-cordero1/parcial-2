/* eslint-disable prettier/prettier */
export class BusinessLogicException extends Error {
  type: BusinessError;

  constructor(message: string, type: number) {
    super(message);

    Object.setPrototypeOf(this, BusinessLogicException.prototype);
    this.name = 'BusinessLogicException';
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
