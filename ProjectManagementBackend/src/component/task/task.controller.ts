import { Body, Controller, forwardRef, Get, Inject, Param, Post, Req } from '@nestjs/common';
import { ObjectId } from 'mongoose';
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

}
