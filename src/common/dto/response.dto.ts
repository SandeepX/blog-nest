export class ResponseDto<T> {
  status: string;
  message: string;
  data: T | null;

  constructor(
    data: T | null,
    message = 'Request Successful',
    status = 'success',
  ) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
}
