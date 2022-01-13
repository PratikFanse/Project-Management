import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/role/role.enum';
import { throws } from 'assert';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly User: Model<User>){
    // this.creatUser()
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
        console.log(e)
        throw new BadRequestException();
      };
    }
    else {
      return {isCreated: false, msg:"Email Id already exist!"}
    }
  }
  

  async creatUser() {
    let password ='test123'
    const passwordHash = await this.encrypt(password);
    const newUser = new this.User({email:'pratik@yopmail.com', username:'Pratik', password:passwordHash, role:Role.Admin})
    const result = await newUser.save(); 
  }
  // private  users:User[] = [];
  async findOne(email: string): Promise<User | undefined> {
    let user:User = await this.User.findOne({email: email}).exec() as User;
    user = {
      id:user.id,
      username:user.username,
      email:user.email,
      password:user.password,
      role:user.role
    }
    return user;
  }

  async encrypt(password){
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  async validatePassword(password:string, hash: string ):Promise<boolean>{
    return await bcrypt.compare(password, hash)
  }
}