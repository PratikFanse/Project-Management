import { Task } from './models/task.model';
import { TaskService } from './task.service';
export declare class TaskController {
    private taskService;
    constructor(taskService: TaskService);
    addNewTask(newTask: Task, req: any): Promise<void>;
    updateTask(task: Task, req: any): Promise<void>;
    getAllTask(req: any, projectId: string): Promise<any[]>;
    getTaskListByCategory(req: any, category: string, projectId: string): Promise<any[]>;
    getTaskById(req: any, id: string): Promise<any>;
    nextTransission(req: any, taskId: string): Promise<void>;
    changeTransission(task: any): Promise<void>;
    deleteTask(taskId: string, req: any): Promise<void>;
}
