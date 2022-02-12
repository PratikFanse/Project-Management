/// <reference types="mongoose" />
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { OTPService } from 'src/auth/otp/otp.service';
import { ResetPassword } from './models/resetPassword.model';
import { NewUser } from './models/newUser.model';
export declare class UserController {
    private authService;
    private userService;
    private otpService;
    private redis;
    constructor(authService: AuthService, userService: UserService, otpService: OTPService);
    createUser(newUser: any): Promise<{
        isCreated: boolean;
        msg?: undefined;
    } | {
        isCreated: boolean;
        msg: string;
    }>;
    login(req: Request, res: Response): Promise<string>;
    logout(res: Response, req: Request): boolean;
    getProfile(req: any): any;
    getUsersList(usersFilter: string): Promise<(import("mongoose").Document<any, any, import("./models/user.model").User> & import("./models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    sendOtpServices(req: any): Promise<string>;
    setNewPassword(resetPassword: ResetPassword): Promise<{
        isPasswordReset: boolean;
    }>;
    signUp(newUser: NewUser): Promise<{
        isCreated: boolean;
        msg?: undefined;
    } | {
        isCreated: boolean;
        msg: string;
    }>;
    updateUserRole(newRole: any): Promise<void>;
}
