import * as mongoose from 'mongoose';
export declare const UserScema: mongoose.Schema<any, mongoose.Model<any, any, any, any>, any, any>;
export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    role: string;
    birthDate: Date;
}
