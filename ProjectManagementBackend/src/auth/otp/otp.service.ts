import { BadGatewayException, forwardRef, Inject, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { MailService } from 'src/component/mail/mail.service';
import { RedisConnection } from 'src/component/redis/redis.model';
import { UserService } from 'src/component/users/user.service';
import { User } from '../../component/users/models/user.model';

@Injectable()
export class OTPService {
    private redis = new RedisConnection().getConnection()
    constructor(
        @Inject(forwardRef(() => UserService))private usersService: UserService, 
        private mailService: MailService) {}
    
    async sendOTP(email:string){
       const user:User = await this.usersService.findOne(email)
       if(user){
            const OTP = Math.floor(100000 + Math.random()*900000);
            const userToken = await this.usersService.encrypt(user.email)
            this.redis.set(userToken,OTP)
            this.redis.expire(userToken,60*5)
            console.log(userToken)
           try{
                await this.mailService.sendOTP(user.email, OTP)
            } catch(e){
                throw new BadGatewayException()
            }
           return userToken
       } else {
            throw new NotFoundException(); 
       }
    }

    async validateOTP(userToken: string, otp: number):Promise<Boolean> {
        const userOtp = await this.redis.get(userToken)
        console.log(userOtp)
        if(userOtp && userOtp === userOtp){
            this.redis.del(userToken)
            return true;
        } else{
            throw new NotFoundException()
        }
    }
}
