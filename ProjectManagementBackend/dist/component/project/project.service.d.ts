import { Model } from 'mongoose';
import { User } from '../users/models/user.model';
import { Project } from './models/project.model';
export declare class ProjectService {
    private readonly Project;
    private redis;
    constructor(Project: Model<Project>);
    createProject(project: any, userToken: any): Promise<void>;
    getProjectList(userToken: any): Promise<Project[]>;
    getProjectMembers(projectId: string): Promise<User[]>;
    updateProject(project: any): Promise<void>;
    userProjects(user: any): Promise<string[]>;
    getProject(projectId: string, userToken: any): Promise<Project>;
}
