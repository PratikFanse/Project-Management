import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService){}
    async sendOTP(sendTo:string, otp:number){
        await this.mailerService.sendMail({
            to: sendTo,
            subject:'Forgot password OTP',
            html: `
                <h3>Project Management</h3>
                <p>
                    Your OTP for forfot password:<b>${otp}</b>
                </p>
                `
        });
    }
}
