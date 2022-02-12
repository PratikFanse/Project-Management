import * as mongoose from 'mongoose';
import { User } from '../../users/models/user.model';
export declare const ProjectScema: mongoose.Schema<any, mongoose.Model<any, any, any, any>, any, any>;
export interface Project {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    owner: User;
    members: User[];
    status: string;
}
