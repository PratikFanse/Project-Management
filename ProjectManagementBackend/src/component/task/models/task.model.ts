import * as mongoose from 'mongoose';
import { Project } from 'src/component/project/models/project.model';
import { User } from '../../users/models/user.model';

export const TaskScema = new mongoose.Schema({
    title: { type: String, required:true},
    startDate: {type: Date, required:true},
    endDate: {type: Date, required:true},
    description: { type: String },
    owner:{type:Object, ref:'User'},
    isPersonal:{type:Boolean, default:true},
    project:{type:Object, ref:'Project'},
    trasition:{type:String, enum:['todo','inprogress','review','completed'], default:'todo'},
    isActive: {type:Boolean, default:true},
    deletedAt:Date,
    createdBy:{type:Object, ref:'User'},
    deletedBy:{type:Object, ref:'User'}
}, {timestamps:true});

export interface Task{
    id:string;
    title: string;
    startDate: Date;
    endDate: Date;
    owner: User;
    project: Project;
    isPersonal: boolean;
    trasition:string;
    createdBy:User;
}