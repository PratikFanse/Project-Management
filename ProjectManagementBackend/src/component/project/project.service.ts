import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
// import * as mongoose from 'mongoose';
// import { Role } from 'src/auth/role/role.enum';
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
        console.log('userProjects')
        // user =  new mongoose.Types.ObjectId(user)
        const projects = await this.Project.find({ members: user, isActive:true }).select({title:1}).exec() as Project[]
        return projects.map((project)=>project.id)
        // const query = this.Project.find()
        // query.where('members').elemMatch({_id:user})
        // const projects = await this.Project.find({ members:{$elemMatch:{_id:user,role:{$in:[Role.Manager,Role.QA]}}}, isActive:true }).populate('members','role','User').select({title:1}).exec() as Project[]
        // const projects = await query.exec()
        // console.log('Projects:',projects)
        // return projects
    }

    async getProject(projectId: string, userToken) {
        const userId = await this.usersService.getUserFormToken(userToken);
        const project = await this.Project.findOne({_id:projectId, 
            $or:[{members:{$elemMatch:{userId}}},{owner:userId}]
        }).exec() as Project
        return project;
     }
}
