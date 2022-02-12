import { Model } from 'mongoose';
import { ProjectService } from '../project/project.service';
import { Task } from './models/task.model';
export declare class TaskService {
    private readonly Task;
    private projectService;
    private redis;
    constructor(Task: Model<Task>, projectService: ProjectService);
    createNewTask(newTask: Task, userToken: any): Promise<void>;
    updateTask(task: any, userToken: any): Promise<void>;
    getTaskListByCategory(userToken: any, category: String, projectId: any): Promise<any[]>;
    getByCategory(category: any, role: any, userId: any, projectId: any): Promise<any[]>;
    getTaskById(userToken: any, taskId: any): Promise<any>;
    nextTransission(userToken: any, taskId: string): Promise<void>;
    changeTransission(taskTransission: any): Promise<void>;
    deleteTask(taskId: any, userToken: any): Promise<void>;
    setTasksInRedis(): Promise<void>;
    redisTaskUpdateById(taskId: any): Promise<void>;
}
