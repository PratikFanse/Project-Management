import { Body, Controller, Get, Param, Post, Put, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { Public } from 'src/auth/role/roles.guard';
import { UserService } from './user.service';
import { OTPService } from 'src/auth/otp/otp.service';
import { ResetPassword } from './models/resetPassword.model';
import { NewUser } from './models/newUser.model';
import { RedisConnection } from '../redis/redis.model';


@Controller('user')
export class UserController {
  private redis = new RedisConnection().getConnection()
  constructor(private authService: AuthService, private userService: UserService, private otpService:OTPService){}

  @Post('signin')
  @Public()
  createUser(@Body() newUser: any){
    return this.userService.createNewUser(newUser)
  }

  @Public()
  @Post('login')
  async login(@Req() req: Request, @Res({passthrough:true}) res:Response) {
    const user = await this.authService.validateUser(req.body.email, req.body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const access_token = this.authService.login(user).access_token;
    this.redis.set(access_token,JSON.stringify(user))
    this.redis.expire(access_token,60*60)
    res.cookie("access_token",access_token,{maxAge: 60 * 60 * 1000});
    return access_token
  }
    
  @Public()
  @Get('logout')
  logout(@Res({passthrough:true}) res:Response,@Req() req: Request){
    this.redis.del(req.headers.authorization.replace('Bearer ',''))
    res.clearCookie("access_token");
    return true
  }

  // @Public()
  @Get('profile')
  @Roles(Role.Admin)
  getProfile(@Req() req) {
    return req.user;
  }

  @Roles(Role.Admin)
  @Get('getUsersList/:usersFilter')
  getUsersList( @Param('usersFilter') usersFilter:string){
    return this.userService.getUsersList(usersFilter)
  }

  @Public()
  @Post('forgotPassword')
  sendOtpServices(@Req() req){
    return this.otpService.sendOTP(req.body.email)
  }

  @Public()
  @Post('resetPassword')
  setNewPassword(@Body() resetPassword: ResetPassword){
    return this.userService.setNewPassword(resetPassword)
  }

  @Public()
  @Post('signUp')
  signUp(@Body() newUser: NewUser){
    return this.userService.createNewUser(newUser);
  }
  
  @Roles(Role.Admin)
  @Put('updateUserRole')
  updateUserRole(@Body() newRole){
    return this.userService.updateUserRole(newRole)
  }
}
