import { Result } from "src/shared/domain/result";

export const NOTIFICATION_SERVICE = Symbol("NOTIFICATION_SERVICE");

export interface INotificationService {

    welcome(props: {to: string, firstName: string}): Promise<Result<void>>;

    sendOTP(props: {to: string}): Promise<Result<void>>;
}