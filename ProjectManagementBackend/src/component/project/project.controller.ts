import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { Public } from 'src/auth/role/roles.guard';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
    constructor(private projectService:ProjectService){}

    // @Public()
    @Post('createProject')
    @Roles(Role.Admin)
    createProject(@Body() project, @Req() req){
        this.projectService.createProject(project, req.headers.authorization)
    }

    @Get('getProjectList')
    getProjectList( @Req() req){
        return this.projectService.getProjectList(req.headers.authorization)
    }
    
    @Get('getProjectMembers/:projectId')
    getProjectMembers(@Param('projectId') projectId:string){
        return this.projectService.getProjectMembers(projectId)
    }

    @Get('getProject/:projectId')
    getProject(@Param('projectId') projectId:string, @Req() req){
        return this.projectService.getProject(projectId, req.headers.authorization)
    }

    @Roles(Role.Manager)
    @Put('updateProject')
    updateProject(@Body() project){
        this.projectService.updateProject(project)
    }
}
