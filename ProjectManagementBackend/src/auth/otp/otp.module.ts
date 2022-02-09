import { Global, Module } from '@nestjs/common';
import { MailModule } from 'src/component/mail/mail.module';
import { OTPService } from './otp.service';
@Global()
@Module({ 
    imports:[MailModule],
    providers:[OTPService],
    exports: [OTPService]})
export class OtpModule {}
