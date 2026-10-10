import { AppError } from './app-error';

export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', isOperational: boolean = true) {
    super(message, 500, isOperational);
  }
}
