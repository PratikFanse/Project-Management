import * as mongoose from 'mongoose';
import { User } from '../../users/models/user.model';
const ObjectId = mongoose.Schema.Types.ObjectId;
export const ProjectScema = new mongoose.Schema({
    title: { type: String, required:true},
    startDate: {type: Date, required:true},
    endDate: {type: Date, required:true},
    description: { type: String },
    status:{type:String, enum:['active','closed'], default:'active'},
    members:[{type:Object, ref:'User'}],
    isActive: {type:Boolean, default:true},
    deletedAt:Date,
    owner:{type:Object, ref:'User', required:true},
    deletedBy:{type:Object, ref:'User'}
}, {timestamps:true});

export interface Project{
    id:string;
    title: string;
    startDate: Date;
    endDate: Date;
    owner: User;
    members: User[];
    status: string;
}