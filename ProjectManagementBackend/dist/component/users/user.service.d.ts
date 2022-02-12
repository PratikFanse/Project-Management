import { Model } from 'mongoose';
import { User } from './models/user.model';
import { OTPService } from 'src/auth/otp/otp.service';
import { ResetPassword } from './models/resetPassword.model';
import { NewUser } from './models/newUser.model';
export declare class UserService {
    private readonly User;
    private otpService;
    constructor(User: Model<User>, otpService: OTPService);
    getUsersList(usersFilter: any): Promise<(import("mongoose").Document<any, any, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    createNewUser(user: NewUser): Promise<{
        isCreated: boolean;
        msg?: undefined;
    } | {
        isCreated: boolean;
        msg: string;
    }>;
    setNewPassword(resetPassword: ResetPassword): Promise<{
        isPasswordReset: boolean;
    }>;
    findOne(email: string): Promise<User | undefined>;
    updateUserRole(newRole: any): Promise<void>;
    encrypt(text: any): Promise<string>;
    validateText(text: string, hash: string): Promise<boolean>;
}
