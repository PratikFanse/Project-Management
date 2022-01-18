import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/component/mail/mail.module';
import { MailService } from 'src/component/mail/mail.service';
import { UserModule } from 'src/component/users/user.module';
import { UserService } from 'src/component/users/user.service';
import { OTPSchema } from './opt.model';
import { OTPService } from './otp.service';
@Global()
@Module({ 
    imports:[
        MongooseModule.forFeature([{name:'OTP', schema: OTPSchema}]),
        MailModule],
    providers:[OTPService],
    exports: [OTPService]})
export class OtpModule {}
