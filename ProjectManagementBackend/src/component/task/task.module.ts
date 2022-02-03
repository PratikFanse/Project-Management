import { Module } from '@nestjs/common';
import { TaskScema } from './models/task.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProjectModule } from '../project/project.module';

@Module({
    imports:[
        MongooseModule.forFeature([{name:'Task', schema: TaskScema}]),
        ProjectModule
    ],
    providers: [TaskService],
    exports: [TaskService],
    controllers: [TaskController],
})
export class TaskModule {
    constructor(){}
}
