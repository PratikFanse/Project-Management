import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, ObjectId } from 'mongoose';
import { ProjectService } from '../project/project.service';
import { UserService } from '../users/user.service';
import { Task } from './models/task.model';

@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly Task: Model<Task>,
    @Inject(forwardRef(() => UserService))private usersService: UserService,
    @Inject(forwardRef(() => ProjectService))private projectService: ProjectService ){}

    async createNewTask(newTask:Task, userToken) {
        const creator = await this.usersService.getUserFormToken(userToken)
        console.log(newTask)
        const isValidData = newTask && newTask.title && newTask.startDate && newTask.endDate && creator && 
                (newTask.isPersonal || (!newTask.isPersonal && newTask.project &&newTask.owner))
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
        const taskList:Task[] = await this.Task.find({$or:[{createdBy: user},{owner:user}]}).populate('project', 'title', 'Project').sort({endDate: 1}).exec() as Task[]
        return taskList ? taskList: []
    }

    async updateTask(task, userToken){
        const user = await this.usersService.getUserFormToken(userToken)
        await this.Task.updateOne({_id:task._id, $or:[{createdBy: user},{owner:user}]},{$set:{...task}}).exec() 
    }


    async getTaskListByCategory(userToken: any, category: String) {
        console.log(category)
        const user = await this.usersService.getUserFormToken(userToken)
        let query ={}
        if(category=="pending"){
            query= {$or:[{createdBy: user},{owner:user}]};
        } else if(category=="isPersonal") {
            query= {isPersonal:true , createdBy: user};
        } else{
            query = {transission:category ,$or:[{createdBy: user},{owner:user}]}
        }
        const taskList:Task[] = await this.Task.find(query).populate('project', 'title', 'Project').sort({endDate: 1}).exec() as Task[]
        if(category=="pending"){
            let pendingTasks =[]
            taskList.map((task)=>{
                if(moment(task.endDate).isBefore(moment(),'date')){
                    pendingTasks.push(task)
                }
            })
            return pendingTasks;
        } else
            return taskList ? taskList: []
    }

    async getTaskById(userToken, taskId){
        const user = await this.usersService.getUserFormToken(userToken)
        const task = 
            JSON.parse(
                JSON.stringify(
                    await this.Task.findOne({_id:taskId, $or:[{createdBy: user},{owner:user}]})
                )
            );
        if(task.project && task.project!=='none'){
            task['projectList']=await this.projectService.getProjectList()
            task['memberList']=await this.projectService.getProjectMembers(task.project)
        }
        if(task) 
            return task 
        else 
            throw new NotFoundException();
    }

    async nextTransission(userToken: any, taskId: string) {
        const transission = ['todo','inprogress','review','completed'];
        const user = await this.usersService.getUserFormToken(userToken)
        const task = await this.Task.findOne({_id:taskId, $or:[{createdBy: user},{owner:user}]});
        if(task.transission!=='completed'){
            task.transission = transission[transission.indexOf(task.transission)+1];
            task.save();
        }
    }

    async changeTransission(taskTransission) {
        await this.Task.updateOne({_id:taskTransission.taskId},{$set:{transission:taskTransission.transission}});
    }

}
