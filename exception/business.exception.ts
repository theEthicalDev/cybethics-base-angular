export class BusinessException {
  public exceptionCode: string;
  public message: string;
  public args: string[];

  constructor(exceptionCode: string, message: string, args: Array<string>) {
    this.exceptionCode = exceptionCode;
    this.message = message;
    this.args = args;
  }
}

export function isBusinessException(err: any, code?: ExceptionCode): boolean {
  return err instanceof BusinessException && (!code || err.exceptionCode === code);
}

export enum ExceptionCode {
  BUSINESS_ERROR_0000 = 'BUSINESS_ERROR_0000',
  BUSINESS_ERROR_0005 = 'BUSINESS_ERROR_0005',
  BUSINESS_ERROR_0100 = 'BUSINESS_ERROR_0100',
  INVALID_CSRF_TOKEN = 'BUSINESS_ERROR_0012',
  PURCHASE_STATUS_NO_LONGER_WAITING_FOR_PAYMENT = 'PURCHASE_STATUS_NO_LONGER_WAITING_FOR_PAYMENT',
}