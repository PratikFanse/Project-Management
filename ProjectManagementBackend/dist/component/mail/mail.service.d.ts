import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendOTP(sendTo: string, otp: number): Promise<void>;
}
