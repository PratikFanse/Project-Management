import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisConnection } from '../redis/redis.model';
import { User } from '../users/models/user.model';
import { Project } from './models/project.model';

@Injectable()
export class ProjectService {
    private redis = new RedisConnection().getConnection()
    constructor(@InjectModel('Project') private readonly Project: Model<Project>){}

    async createProject(project, userToken){
        const creator = JSON.parse(await this.redis.get(userToken.replace('Bearer ','')));
        const isValidData = project && project.title && project.startDate && project.endDate && creator
        if(isValidData){
            const newProject = new this.Project({...project,owner:creator.id});
            await newProject.save();
        } else
            throw new BadRequestException();
    }

    async getProjectList(userToken){
        const userId = JSON.parse(await this.redis.get(userToken.replace('Bearer ',''))).id;
        const projectList:Project[] = 
            await this.Project.find({isActive:true, $or:[{members:userId},{owner:userId}]})
            .populate('owner','username email role','User').exec() as Project[]
        return projectList?projectList:[];
    }

    async getProjectMembers(projectId: string) {
        const memberList:User[] = 
            (await this.Project.findOne({_id:projectId})
            .populate('members', 'username email role', 'User').exec() as Project).members
        return memberList?memberList:[];
    }

    async updateProject(project){
        const isValidData = project && project.title && project.startDate && project.endDate
        if(isValidData)
            await this.Project.updateOne({_id:project._id},{$set:project}).exec();
        else
            throw new BadRequestException();
    }
    
    async userProjects(user){
        // user =  new mongoose.Types.ObjectId(user)
        const projects = await this.Project.find({ members: user, isActive:true }).select({title:1}).exec() as Project[]
        return projects.map((project)=>project.id)
        // const query = this.Project.find()
        // query.where('members').elemMatch({_id:user})
        // const projects = await this.Project.find({ members:{$elemMatch:{_id:user,role:{$in:[Role.Manager,Role.QA]}}}, isActive:true }).populate('members','role','User').select({title:1}).exec() as Project[]
        // const projects = await query.exec()
        // return projects
    }

    async getProject(projectId: string, userToken) {
        const userId = JSON.parse(await this.redis.get(userToken.replace('Bearer ',''))).id;
        const project = await this.Project.findOne({_id:projectId, 
            $or:[{members:userId},{owner:userId}]
        }).exec() as Project
        return project;
     }
}
