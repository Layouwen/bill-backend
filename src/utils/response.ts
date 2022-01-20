class BaseResponse {
  public statusCode: number;
  public message: string;
}

export class SuccessResponse extends BaseResponse {
  constructor(private data: any, message = 'success') {
    super();
    this.statusCode = 200;
    if (typeof data === 'string') {
      this.message = data;
    } else {
      this.message = message;
      this.data = data;
    }
  }
}

export class ErrorResponse extends BaseResponse {
  constructor(message: string) {
    super();
    this.statusCode = 400;
    this.message = message;
  }
}

export class AuthSuccessResponse extends BaseResponse {
  private data: any;

  constructor(message: string, token: string) {
    super();
    this.statusCode = 200;
    this.message = message;
    this.data = { token };
  }
}
