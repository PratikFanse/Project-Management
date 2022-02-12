"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const redis_model_1 = require("../redis/redis.model");
let ProjectService = class ProjectService {
    constructor(Project) {
        this.Project = Project;
        this.redis = new redis_model_1.RedisConnection().getConnection();
    }
    async createProject(project, userToken) {
        const creator = JSON.parse(await this.redis.get(userToken.replace('Bearer ', '')));
        const isValidData = project && project.title && project.startDate && project.endDate && creator;
        if (isValidData) {
            const newProject = new this.Project(Object.assign(Object.assign({}, project), { owner: creator.id }));
            await newProject.save();
        }
        else
            throw new common_1.BadRequestException();
    }
    async getProjectList(userToken) {
        const userId = JSON.parse(await this.redis.get(userToken.replace('Bearer ', ''))).id;
        const projectList = await this.Project.find({ isActive: true, $or: [{ members: userId }, { owner: userId }] })
            .populate('owner', 'username email role', 'User').exec();
        return projectList ? projectList : [];
    }
    async getProjectMembers(projectId) {
        const memberList = (await this.Project.findOne({ _id: projectId })
            .populate('members', 'username email role', 'User').exec()).members;
        return memberList ? memberList : [];
    }
    async updateProject(project) {
        const isValidData = project && project.title && project.startDate && project.endDate;
        if (isValidData)
            await this.Project.updateOne({ _id: project._id }, { $set: project }).exec();
        else
            throw new common_1.BadRequestException();
    }
    async userProjects(user) {
        const projects = await this.Project.find({ members: user, isActive: true }).select({ title: 1 }).exec();
        return projects.map((project) => project.id);
    }
    async getProject(projectId, userToken) {
        const userId = JSON.parse(await this.redis.get(userToken.replace('Bearer ', ''))).id;
        const project = await this.Project.findOne({ _id: projectId,
            $or: [{ members: userId }, { owner: userId }]
        }).exec();
        return project;
    }
};
ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Project')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map