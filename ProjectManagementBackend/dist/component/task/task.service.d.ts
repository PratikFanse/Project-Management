import { Model } from 'mongoose';
import { ProjectService } from '../project/project.service';
import { Task } from './models/task.model';
import { SentryService } from '@ntegral/nestjs-sentry';
export declare class TaskService {
    private readonly Task;
    private projectService;
    private readonly client;
    private redis;
    constructor(Task: Model<Task>, projectService: ProjectService, client: SentryService);
    createNewTask(newTask: Task, userToken: any): Promise<void>;
    updateTask(task: any, userToken: any): Promise<void>;
    getTaskListByCategory(userToken: any, category: String, projectId: any): Promise<any[]>;
    getByCategory(category: any, role: any, userId: any, projectId: any): Promise<any[]>;
    getTaskById(userToken: any, taskId: any): Promise<any>;
    nextTrasition(userToken: any, taskId: string): Promise<void>;
    changeTrasition(taskTrasition: any): Promise<void>;
    deleteTask(taskId: any, userToken: any): Promise<void>;
    setTasksInRedis(): Promise<void>;
    redisTaskUpdateById(taskId: any): Promise<void>;
}
