import { Body, Controller, forwardRef, Get, Inject, Param, Post, Put, Req } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { Public } from 'src/auth/role/roles.guard';
import { UserService } from '../users/user.service';
import { Task } from './models/task.model';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private taskService:TaskService){}
       
    @Post('addNewTask')
    async addNewTask(@Body() newTask:Task, @Req() req){
       return this.taskService.createNewTask(newTask, req.headers.authorization)
    }
    @Post('updateTask')
    async updateTask(@Body() task:Task, @Req() req){
       return this.taskService.updateTask(task, req.headers.authorization)
    }
    @Get('getAllTask')
    getAllTask(@Req() req){
        return this.taskService.getAllTask(req.headers.authorization)
    }

    @Get('getTaskListByCategory/:category')
    getTaskListByCategory(@Req() req, @Param('category') category: string){
        return this.taskService.getTaskListByCategory(req.headers.authorization, category)
    }
    
    @Get('getTaskById/:id')
    getTaskById(@Req() req, @Param('id') id: string){
        return this.taskService.getTaskById(req.headers.authorization, id)
    }

    @Put('nextTransission/:taskId')
    nextTransission(@Req() req, @Param('taskId') taskId: string){
        console.log('nextTransission')
        return this.taskService.nextTransission(req.headers.authorization, taskId)
    }

    @Roles(Role.QA)
    @Put('changeTransission')
    changeTransission(@Body() task){
        console.log(task)
        return this.taskService.changeTransission(task)
    }

}
