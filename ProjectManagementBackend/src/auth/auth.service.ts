import { Injectable } from '@nestjs/common';
import { UserService } from 'src/component/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { User } from 'src/component/users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user:User = await this.usersService.findOne(email);
    const isValid=await this.usersService.validateText(pass, user.password);
    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user) {
    const payload = { username: user.username, sub: user.email, role:user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}