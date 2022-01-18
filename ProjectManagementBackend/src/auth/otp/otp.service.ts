import { BadGatewayException, forwardRef, Inject, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/component/mail/mail.service';
import { UserService } from 'src/component/users/user.service';
import { User } from '../../component/users/models/user.model';
import { OTP } from './opt.model';

@Injectable()
export class OTPService {
    constructor(
        @InjectModel('OTP') private readonly OTP: Model<OTP>,
        @Inject(forwardRef(() => UserService))private usersService: UserService, 
        private mailService: MailService) {}
    
    async sendOTP(email:string){
       const user:User = await this.usersService.findOne(email)
       if(user){
            const OTP = Math.floor(100000 + Math.random()*900000);
            const userToken = await this.usersService.encrypt(user.email)
            const expireIn = new Date();
            expireIn.setMinutes(expireIn.getMinutes()+5)
            const newOTP = new this.OTP({
                otp:OTP,
                expireIn: expireIn,
                userToken: userToken
           })
           await newOTP.save();
           try{
                await this.mailService.sendOTP(user.email, newOTP.otp)
            } catch(e){
                throw new BadGatewayException()
            }
           return newOTP.userToken
       } else {
            throw new NotFoundException(); 
       }
    }

    async validateOTP(userToken: string, otp: number):Promise<Boolean> {
        const otpObj = await this.OTP.findOne({otp:otp, userToken:userToken, isActive: true}).exec();
        if(otpObj){
            if((otpObj.expireIn.getTime()+300*1000) - new Date().getTime()>0){
                otpObj.isActive = false
                await otpObj.save();
                return true;
            } else {
                otpObj.isActive = false
                await otpObj.save();
                throw new RequestTimeoutException()
            }
        } else{
            throw new NotFoundException()
        }
    }
}
