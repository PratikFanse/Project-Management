import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ProjectScema } from './models/project.model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
    imports:[
        MongooseModule.forFeature([{name:'Project', schema: ProjectScema}])
    ],
    providers: [ProjectService],
    exports: [ProjectService],
    controllers: [ProjectController],
})
export class ProjectModule {}
