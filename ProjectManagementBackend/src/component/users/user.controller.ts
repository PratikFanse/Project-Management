import { Body, Controller, forwardRef, Get, Inject, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { Public } from 'src/auth/role/roles.guard';
import { UserService } from './user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OTPService } from 'src/auth/otp/otp.service';
import { ResetPassword } from './models/resetPassword.model';
import { NewUser } from './models/newUser.model';


@Controller('user')
export class UserController {

    constructor(private authService: AuthService, private userService: UserService, private otpService:OTPService){}

    @Post('signin')
    @Public()
    createUser(@Body() newUser: any){
      return this.userService.createNewUser(newUser)
    }

    @Public()
    @Post('login')
    async login(@Req() req: Request, @Res({passthrough:true}) res:Response) {
      console.log('login',req.body.email)
      const user = await this.authService.validateUser(req.body.email, req.body.password);
      if (!user) {
        throw new UnauthorizedException();
      }
      const access_token = this.authService.login(user).access_token;
      // res.cookie("access_token",this.authService.login(req.user).access_token,{maxAge: 24 *60 * 60 * 1000});
      res.cookie("access_token",access_token,{maxAge: 60 * 60 * 1000});
      return access_token
    }
    
    @Public()
    @Get('logout')
    logout(@Res({passthrough:true}) res:Response){
      res.clearCookie("access_token");
      return true
    }

    // @Public()
    @Get('profile')
    @Roles(Role.Admin)
    getProfile(@Req() req) {
      return req.user;
    }

    @Public()
    @Get('accountRequest')
    // @Roles(Role.Admin)
    getAccountRequest(@Req() req){
      console.log(req.query)
      return this.userService.findAllRequest()
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
}
