/**
 * Core error classes for Huawei LTE API
 * Based on Python implementation: huawei_lte_api/exceptions.py
 */

export class ResponseErrorException extends Error {
  public readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'ResponseErrorException';
    this.code = code;
    Object.setPrototypeOf(this, ResponseErrorException.prototype);
  }
}

export class ResponseErrorNotSupportedException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'ResponseErrorNotSupportedException';
    Object.setPrototypeOf(this, ResponseErrorNotSupportedException.prototype);
  }
}

export class ResponseErrorLoginRequiredException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'ResponseErrorLoginRequiredException';
    Object.setPrototypeOf(this, ResponseErrorLoginRequiredException.prototype);
  }
}

export class ResponseErrorSystemBusyException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'ResponseErrorSystemBusyException';
    Object.setPrototypeOf(this, ResponseErrorSystemBusyException.prototype);
  }
}

export class ResponseErrorLoginCsrfException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'ResponseErrorLoginCsrfException';
    Object.setPrototypeOf(this, ResponseErrorLoginCsrfException.prototype);
  }
}

export class ResponseErrorWrongSessionToken extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'ResponseErrorWrongSessionToken';
    Object.setPrototypeOf(this, ResponseErrorWrongSessionToken.prototype);
  }
}

export class RequestFormatException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'RequestFormatException';
    Object.setPrototypeOf(this, RequestFormatException.prototype);
  }
}

// Login specific errors
export class LoginErrorInvalidCredentialsException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorInvalidCredentialsException';
    Object.setPrototypeOf(this, LoginErrorInvalidCredentialsException.prototype);
  }
}

export class LoginErrorUsernameWrongException extends LoginErrorInvalidCredentialsException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorUsernameWrongException';
    Object.setPrototypeOf(this, LoginErrorUsernameWrongException.prototype);
  }
}

export class LoginErrorPasswordWrongException extends LoginErrorInvalidCredentialsException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorPasswordWrongException';
    Object.setPrototypeOf(this, LoginErrorPasswordWrongException.prototype);
  }
}

export class LoginErrorAlreadyLoginException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorAlreadyLoginException';
    Object.setPrototypeOf(this, LoginErrorAlreadyLoginException.prototype);
  }
}

export class LoginErrorUsernamePasswordWrongException extends LoginErrorInvalidCredentialsException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorUsernamePasswordWrongException';
    Object.setPrototypeOf(this, LoginErrorUsernamePasswordWrongException.prototype);
  }
}

export class LoginErrorUsernamePasswordOverrunException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorUsernamePasswordOverrunException';
    Object.setPrototypeOf(this, LoginErrorUsernamePasswordOverrunException.prototype);
  }
}

export class LoginErrorUsernamePasswordModifyException extends ResponseErrorException {
  constructor(message: string, code: number) {
    super(message, code);
    this.name = 'LoginErrorUsernamePasswordModifyException';
    Object.setPrototypeOf(this, LoginErrorUsernamePasswordModifyException.prototype);
  }
}
