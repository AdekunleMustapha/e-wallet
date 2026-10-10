import { AppError } from './app-error';

export class UnprocessableEntityError extends AppError {
  public readonly details?: any;

  constructor(message: string = 'Unprocessable Entity', details?: any) {
    super(message, 422);
    this.details = details;
  }
}
