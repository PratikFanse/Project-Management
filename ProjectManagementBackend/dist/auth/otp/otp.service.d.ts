import { MailService } from 'src/component/mail/mail.service';
import { UserService } from 'src/component/users/user.service';
export declare class OTPService {
    private usersService;
    private mailService;
    private redis;
    constructor(usersService: UserService, mailService: MailService);
    sendOTP(email: string): Promise<string>;
    validateOTP(userToken: string, otp: number): Promise<Boolean>;
}
