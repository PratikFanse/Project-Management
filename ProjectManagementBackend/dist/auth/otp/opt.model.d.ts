import * as mongoose from 'mongoose';
export declare const OTPSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any>, any, any>;
export interface OTP {
    otp: number;
    expireIn: Date;
    isActive: Boolean;
    userToken: string;
}
