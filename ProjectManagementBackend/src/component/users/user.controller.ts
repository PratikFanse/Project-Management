import { Body, Controller, forwardRef, Get, Inject, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { Public } from 'src/auth/role/roles.guard';
import { UserService } from './user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Controller('user')
export class UserController {

    constructor(private authService: AuthService, private userService: UserService){}

    @Post('signin')
    @Public()
    createUser(@Body() newUser: any){
      return this.userService.createNewUser(newUser)
    }

    @Public()
    @Post('login')
    async login(@Req() req: Request, @Res({passthrough:true}) res:Response) {
      console.log('login',req.body)
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

    @Get('accountRequest')
    @Roles(Role.Admin)
    getAccountRequest(){
      return 
    }
}
