import * as mongoose from 'mongoose';

export const OTPSchema = new mongoose.Schema({
    otp:{type:String, required:true},
    expireIn:{type:Date, required:true},
    isActive:{type:Boolean, default:true},
    userToken:{type:String, required:true}
},{timestamps:true});

export interface OTP{
    otp:number;
    expireIn:Date;
    isActive:Boolean;
    userToken:string;
}