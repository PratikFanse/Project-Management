import { ProjectService } from './project.service';
export declare class ProjectController {
    private projectService;
    constructor(projectService: ProjectService);
    createProject(project: any, req: any): void;
    getProjectList(req: any): Promise<import("./models/project.model").Project[]>;
    getProjectMembers(projectId: string): Promise<import("../users/models/user.model").User[]>;
    getProject(projectId: string, req: any): Promise<import("./models/project.model").Project>;
    updateProject(project: any): void;
}
