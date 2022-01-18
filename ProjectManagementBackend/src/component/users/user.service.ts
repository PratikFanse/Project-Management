import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/role/role.enum';
import { OTPService } from 'src/auth/otp/otp.service';
import { ResetPassword } from './models/resetPassword.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly User: Model<User>, 
  @Inject(forwardRef(() => OTPService))private otpService:OTPService){
    // this.creatUser()
  }

  async findAllRequest() {
    return await this.User.find().exec();
  }

  async createNewUser(user: any) {
    if(!(await this.User.findOne({email: user.email}).exec() as User)){
      try{
        const passwordHash = await this.encrypt(user.password);
        const newUser = new this.User({
          email: user.email, 
          username: user.username, 
          password:passwordHash, 
          role: Role.Employee
        })
        return await newUser.save() ? true : false
      } catch(e){
        throw new BadRequestException();
      };
    }
    else {
      return {isCreated: false, msg:"Email Id already exist!"}
    }
  }
  
  async setNewPassword(resetPassword: ResetPassword) {
    if(await this.validateText(resetPassword.email, resetPassword.userToken)){
      if(await this.otpService.validateOTP(resetPassword.userToken,resetPassword.otp)){
        const user = await this.User.findOne({email:resetPassword.email}).exec();
        user.password = resetPassword.newPass;
        try{
          await user.save();
        } catch(e){
          throw new BadRequestException();
        }
      }
    } else {
      throw new ForbiddenException()
    }
  }
  // async creatUser() {
  //   let password ='test123'
  //   const passwordHash = await this.encrypt(password);
  //   const newUser = new this.User({email:'pratik@yopmail.com', username:'Pratik', password:passwordHash, role:Role.Admin})
  //   const result = await newUser.save(); 
  // }
  // private  users:User[] = [];
  async findOne(email: string): Promise<User | undefined> {
    try{
      let user:User = await this.User.findOne({email: email}).exec() as User;
      user = {
        id:user.id,
        username:user.username,
        email:user.email,
        password:user.password,
        role:user.role
      }
      return user;
    } catch(e){
      throw new NotFoundException();
    }
  }

  async encrypt(text){
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(text, salt)
  }

  async validateText(text:string, hash: string ):Promise<boolean>{
    return await bcrypt.compare(text, hash)
  }
}