import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ProjectService } from '../project/project.service';
import { Task } from './models/task.model';
import { Role } from 'src/auth/role/role.enum';
import { RedisConnection } from '../redis/redis.model';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
    private redis = new RedisConnection().getConnection()
    constructor(@InjectModel('Task') private readonly Task: Model<Task>,
    @Inject(forwardRef(() => ProjectService))private projectService: ProjectService,
     ){
        this.setTasksInRedis()
     }

    async createNewTask(newTask:Task, userToken) {
        const creator = JSON.parse(await this.redis.get(userToken.replace('Bearer ','')));
        const isValidData = newTask && newTask.title && newTask.startDate && newTask.endDate && creator && 
                (newTask.isPersonal || (!newTask.isPersonal && newTask.project &&newTask.owner))
        if(isValidData){
            const task = new this.Task({
                ...newTask,
                createdBy:creator.id
            });
            newTask = await task.save() as Task
            await task.save()
            await this.redisTaskUpdateById(task._id)
        } else 
            throw new BadRequestException();
    }

    async updateTask(task, userToken){
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ','')));
        let query={};
        if(user.role==Role.Admin){
            query={_id:task._id, $or:[{createdBy: user.id, isPersonal:true},{owner:user.id},{isPersonal:false}]}
        } else if(user.role===Role.Manager || user.role===Role.QA){
            const projects =await this.projectService.userProjects(user.id)
            query={_id:task._id, $or:[{createdBy: user.id},{owner:user.id},{project:{$in:projects}}]}
        } else {
            query= {_id:task._id, $or:[{createdBy: user.id},{owner:user.id}]}
        }
        await this.Task.updateOne(query,{$set:{...task}}).exec()
        await this.redisTaskUpdateById(task._id)
    }

    async getTaskListByCategory(userToken: any, category: String, projectId) {
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ','')));
        const taskList:Task[] =[]
        taskList.push(...await this.getByCategory(category, user.role, user.id, projectId))
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

    async getByCategory(category, role, userId, projectId){
        let taskKeys = [];
        if(category=="pending" || category==="allTask")
            taskKeys = await this.redis.keys("task_*")
        else if(category==="isPersonal")
            taskKeys = await this.redis.keys("task_personal_*")
        else 
            taskKeys = await this.redis.keys("task_"+category+"*")
        let taskList =[];
        let projects =[];
        if(role!==Role.Admin)
            projects.push(...await this.projectService.userProjects(userId));
        for(const taskKey of taskKeys) {
            const task = JSON.parse(await this.redis.get(taskKey))
            const isPersonal = task.createdBy===userId && task.isPersonal
            if(role!==Role.Employee){
                if((task.project && projectId && task.project._id===projectId )){
                    taskList.push(task);
                } else if(!projectId || projectId==='null') {
                    if(role!==Role.Admin && (category!=="isPersonal" && task.project && projects.includes(task.project._id)) || isPersonal){
                        taskList.push(task);
                    } else if(role===Role.Admin && (isPersonal || (category!=="isPersonal" && !task.isPersonal)))
                        taskList.push(task);
                } 
            } else {
                const searchCondition =task.project && task.owner && ((projectId && task.project._id===projectId) || projectId ==='null' && projects.includes(task.project._id))
                if( (category!=="isPersonal" && searchCondition) || projectId ==='null' && isPersonal){
                    taskList.push(task)
                }
            }
        }
        return taskList
    }

    async getTaskById(userToken, taskId){
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ','')));
        let query ={}
        if(user.role==Role.Admin){
            query={_id:taskId, $or:[{createdBy: user.id, isPersonal:true},{owner:user.id},{isPersonal:false}]}
        } else if(user.role===Role.Manager || user.role===Role.QA){
            const projects =await this.projectService.userProjects(user.id)
            query={_id:taskId, $or:[{createdBy: user.id},{owner:user.id},{project:{$in:projects}}]}
        } else {
            query= {_id:taskId, $or:[{createdBy: user.id},{owner:user.id}]}
        }
        const task = 
            JSON.parse(
                JSON.stringify(
                    await this.Task.findOne(query).exec()
                )
            );
        if(task.project && task.project!=='none'){
            task['projectList']=await this.projectService.getProjectList(userToken)
            task['memberList']=await this.projectService.getProjectMembers(task.project)
        }
        if(task) 
            return task 
        else 
            throw new NotFoundException();
    }

    async nextTrasition(userToken: any, taskId: string) {
        const trasition = ['todo','inprogress','review','completed'];
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ','')));
        let query ={}
        if(user.role==Role.Admin){
            query={_id:taskId, $or:[{createdBy: user.id, isPersonal:true},{owner:user.id},{isPersonal:false}]}
        } else if(user.role===Role.Manager || user.role===Role.QA){
            const projects =await this.projectService.userProjects(user.id)
            query={_id:taskId, $or:[{createdBy: user.id},{owner:user.id},{project:{$in:projects}}]}
        } else {
            query= {_id:taskId, $or:[{createdBy: user.id},{owner:user.id}]}
        }
        const task = await this.Task.findOne(query).exec();
        if(task.trasition!=='completed'){
            task.trasition = trasition[trasition.indexOf(task.trasition)+1];
            await task.save();
            await this.redisTaskUpdateById(taskId)
        }
    }

    async changeTrasition(taskTrasition) {
        await this.Task.updateOne({_id:taskTrasition.taskId},{$set:{trasition:taskTrasition.trasition}});
        await this.redisTaskUpdateById(taskTrasition.taskId)
    }

    async deleteTask(taskId, userToken) {
        const userRole = JSON.parse(await this.redis.get(userToken.replace('Bearer ',''))).role;
        if(userRole==="admin" || userRole==="manager"){
            await this.Task.deleteOne({_id:taskId})
        } else {
            await this.Task.deleteOne({_id:taskId, isPersonal:true})
        }
        this.redis.del(await this.redis.keys('task_*'+taskId))
    }

    @Cron('0 0 5 * * *')
    async setTasksInRedis(){
        const taskList:Task[] = await this.Task.find().populate('project', 'title', 'Project').sort({endDate: 1}).exec() as Task[]
        const taskKey= await this.redis.keys('task_*')
        if(taskKey.length)
            await this.redis.del(taskKey)
        taskList.map(async (task)=>{
            if(task.isPersonal)
                await this.redis.set('task_personal_'+task.trasition+"_"+task.id,JSON.stringify(task))
            else
                await this.redis.set('task_'+task.trasition+"_"+task.id,JSON.stringify(task))
            // await this.redis.set('task_'+task.id,JSON.stringify(task))
        })
    }

    async redisTaskUpdateById(taskId) {
        const task = await this.Task.findById(taskId).populate('project', 'title', 'Project').exec() as Task
        const taskKey= await this.redis.keys('task_*'+task.id,JSON.stringify(task))
        if(taskKey.length)
            await this.redis.del(taskKey)
        if(task.isPersonal)
            await this.redis.set('task_personal_'+task.trasition+"_"+task.id,JSON.stringify(task))
        else
            await this.redis.set('task_'+task.trasition+"_"+task.id,JSON.stringify(task))
    }

}
