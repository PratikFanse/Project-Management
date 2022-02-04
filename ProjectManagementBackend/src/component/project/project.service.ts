import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/models/user.model';
import { UserService } from '../users/user.service';
import { Project } from './models/project.model';

@Injectable()
export class ProjectService {
    constructor(@InjectModel('Project') private readonly Project: Model<Project>,
    @Inject(forwardRef(() => UserService))private usersService: UserService){}

    async createProject(project, userToken){
        const creator = await this.usersService.getUserFormToken(userToken)
        console.log(project)
        // const members = await this.usersService.getUsersByEmailList(project.members)
        // console.log(members)
        const isValidData = project && project.title && project.startDate && project.endDate && creator
        if(isValidData){
            const newProject = new this.Project({...project,owner:creator});
            await newProject.save();
        } else
            throw new BadRequestException();
    }

    async getProjectList(){
        const projectList:Project[] = 
            await this.Project.find({isActive:true})
            .populate('owner','username email role','User').exec() as Project[]
        return projectList?projectList:[];
    }

    async getProjectMembers(projectId: string) {
        console.log(projectId)
        const memberList:User[] = 
            (await this.Project.findOne({_id:projectId})
            .populate('members', 'username email role', 'User').exec() as Project).members
        return memberList?memberList:[];
    }

    async updateProject(project){
        await this.Project.updateOne({_id:project._id},{$set:project}).exec()
    }
    
    async userProjects(user){
        const projects = await this.Project.find({ members: user }).select({title:1}).exec() as Project[]
        return projects.map((project)=>project.id)
    }
}
