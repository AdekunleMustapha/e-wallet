import { Inject, Injectable, Logger } from "@nestjs/common";
import { INotificationService } from "../../../users/domain/services";
import mailConfig from "../../../users/infrastructure/config/mail.config";
import { ConfigType } from "@nestjs/config";
import { Result } from "src/shared/domain/result";
import { createTransport, Transporter } from "nodemailer";
import { InternalError } from "src/shared/domain/errors";

@Injectable()
export class SMTPNotificationService implements INotificationService {
    private readonly logger = new Logger(SMTPNotificationService.name);
    private readonly transporter: Transporter

    constructor(
        @Inject(mailConfig.KEY)
        private readonly config: ConfigType<typeof mailConfig>
    ) {
        this.transporter = createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.password
            }
        })
    }

    public async welcome(props: { to: string, firstName: string; }): Promise<Result<void>> {
        try {
            await this.transporter.sendMail({
                from: `E-wallet <${this.config.from}>`,
                to: props.to,
                subject: "Welcome",
                text: `Hi ${props.firstName}, welcome to e-wallet. Your profile has been created`
            });
            return Result.ok();
        } catch (error) {
            this.logger.error("Error sending welcome message", 
                error instanceof Error ? error.message : String(error)
            );
            return Result.fail(new InternalError("Unable to send mail"));
        }
    }

    public async sendOTP(props: { to: string, token: string, ttl: number }): Promise<Result<void>> {
        try {
            await this.transporter.sendMail({
                from: `E-wallet <${this.config.from}>`,
                to: props.to,
                subject: "Verification OTP",
                text: `Here's your OTP code for verification of this email\n\n${props.token}\n\n
                It will expire in the next ${props.ttl} minutes`
            });
            return Result.ok();
        } catch (error) {
            this.logger.error("Error sending OTP message", 
                error instanceof Error ? error.message : String(error)
            );
            return Result.fail(new InternalError("Unable to send mail"));
        }
    }
}