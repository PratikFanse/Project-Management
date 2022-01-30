import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, ObjectId } from 'mongoose';
import { UserService } from '../users/user.service';
import { Task } from './models/task.model';

@Injectable()
export class TaskService {

    constructor(@InjectModel('Task') private readonly Task: Model<Task>,
    @Inject(forwardRef(() => UserService))private usersService: UserService ){}

    async createNewTask(newTask:Task, userToken) {
        const creator = await this.usersService.getUserFormToken(userToken)
        const isValidData = newTask && newTask.title && newTask.startDate && newTask.endDate && creator && 
                (newTask.isPersonal || (!newTask.isPersonal && newTask.project))
        if(isValidData){
            const task = new this.Task({
                ...newTask,
                createdBy:creator
            });
            await task.save()
        } else 
            throw new BadRequestException();
    }

    async getAllTask(userToken){
        const user = await this.usersService.getUserFormToken(userToken)
        const taskList:Task[] = await this.Task.find({$or:[{createdBy: user},{owner:user}]}) as Task[]
        return taskList ? taskList: []
    }

    async updateTask(task, userToken){
        const user = await this.usersService.getUserFormToken(userToken)
        await this.Task.updateOne({_id:task._id, $or:[{createdBy: user},{owner:user}]},{$set:{...task}}).exec() 
    }


    async getTaskListByCategory(userToken: any, category: String) {
        const user = await this.usersService.getUserFormToken(userToken)
        if(category=="pending"){
            const taskList:Task[] = await this.Task.find({$or:[{createdBy: user},{owner:user}]}) as Task[]
            let pendingTasks =[]
            taskList.map((task)=>{
                if(moment(task.endDate).isBefore(moment(),'date')){
                    pendingTasks.push(task)
                }
            })
            return pendingTasks;
        } else{
            const taskList:Task[] = await this.Task.find({transission:category ,$or:[{createdBy: user},{owner:user}]}) as Task[]
            return taskList ? taskList: []
        }
    }

    async getTaskById(userToken, taskId){
        const user = await this.usersService.getUserFormToken(userToken)
        const taskList:Task = await this.Task.findOne({_id:taskId, $or:[{createdBy: user},{owner:user}]}) as Task
        if(taskList) 
            return taskList 
        else 
            throw new NotFoundException();
    }
}
