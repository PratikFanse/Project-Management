import * as mongoose from 'mongoose';
import { Project } from 'src/component/project/models/project.model';
import { User } from '../../users/models/user.model';
export declare const TaskScema: mongoose.Schema<any, mongoose.Model<any, any, any, any>, any, any>;
export interface Task {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    owner: User;
    project: Project;
    isPersonal: boolean;
    transission: string;
    createdBy: User;
}
