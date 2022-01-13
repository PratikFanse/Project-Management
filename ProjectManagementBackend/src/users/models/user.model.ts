import * as mongoose from'mongoose';

export const UserScema = new mongoose.Schema({
    email: { type: String, required:true, unique:true },
    username: { type: String, required:true },
    password: { type: String, required:true },
    role: {type: String, required: true, enum: ['admin','manager','QA', 'employee']},
    isActive: Boolean,
    acceptedBy:{type:Object, ref:'User'},
    createAt:{type: Date, default: Date.now},
    updatedAt:Date,
    deletedAt:Date,
    deletedBy:{type:Object, ref:'User'}
});

export interface User{
    id: number ;
    email: string;
    username: string;
    password: string;
    role: string;
}