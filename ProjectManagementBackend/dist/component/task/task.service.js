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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const moment = require("moment");
const mongoose_2 = require("mongoose");
const project_service_1 = require("../project/project.service");
const role_enum_1 = require("../../auth/role/role.enum");
const redis_model_1 = require("../redis/redis.model");
const schedule_1 = require("@nestjs/schedule");
let TaskService = class TaskService {
    constructor(Task, projectService) {
        this.Task = Task;
        this.projectService = projectService;
        this.redis = new redis_model_1.RedisConnection().getConnection();
        this.setTasksInRedis();
    }
    async createNewTask(newTask, userToken) {
        const creator = JSON.parse(await this.redis.get(userToken.replace('Bearer ', '')));
        const isValidData = newTask && newTask.title && newTask.startDate && newTask.endDate && creator &&
            (newTask.isPersonal || (!newTask.isPersonal && newTask.project && newTask.owner));
        if (isValidData) {
            const task = new this.Task(Object.assign(Object.assign({}, newTask), { createdBy: creator.id }));
            newTask = await task.save();
            await task.save();
            await this.redisTaskUpdateById(task._id);
        }
        else
            throw new common_1.BadRequestException();
    }
    async updateTask(task, userToken) {
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ', '')));
        let query = {};
        if (user.role == role_enum_1.Role.Admin) {
            query = { _id: task._id, $or: [{ createdBy: user.id, isPersonal: true }, { owner: user.id }, { isPersonal: false }] };
        }
        else if (user.role === role_enum_1.Role.Manager || user.role === role_enum_1.Role.QA) {
            const projects = await this.projectService.userProjects(user.id);
            query = { _id: task._id, $or: [{ createdBy: user.id }, { owner: user.id }, { project: { $in: projects } }] };
        }
        else {
            query = { _id: task._id, $or: [{ createdBy: user.id }, { owner: user.id }] };
        }
        await this.Task.updateOne(query, { $set: Object.assign({}, task) }).exec();
        await this.redisTaskUpdateById(task._id);
    }
    async getTaskListByCategory(userToken, category, projectId) {
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ', '')));
        const taskList = [];
        taskList.push(...await this.getByCategory(category, user.role, user.id, projectId));
        if (category == "pending") {
            let pendingTasks = [];
            taskList.map((task) => {
                if (moment(task.endDate).isBefore(moment(), 'date')) {
                    pendingTasks.push(task);
                }
            });
            return pendingTasks;
        }
        else
            return taskList ? taskList : [];
    }
    async getByCategory(category, role, userId, projectId) {
        let taskKeys = [];
        if (category == "pending" || category === "allTask")
            taskKeys = await this.redis.keys("task_*");
        else if (category === "isPersonal")
            taskKeys = await this.redis.keys("task_personal_*");
        else
            taskKeys = await this.redis.keys("task_" + category + "*");
        let taskList = [];
        let projects = [];
        if (role !== role_enum_1.Role.Admin)
            projects.push(...await this.projectService.userProjects(userId));
        for (const taskKey of taskKeys) {
            const task = JSON.parse(await this.redis.get(taskKey));
            const isPersonal = task.createdBy === userId && task.isPersonal;
            if (role !== role_enum_1.Role.Employee) {
                if ((task.project && projectId && task.project._id === projectId)) {
                    taskList.push(task);
                }
                else if (!projectId || projectId === 'null') {
                    if (role !== role_enum_1.Role.Admin && (category !== "isPersonal" && task.project && projects.includes(task.project._id)) || isPersonal) {
                        taskList.push(task);
                    }
                    else if ((isPersonal || (category !== "isPersonal" && !task.isPersonal)))
                        taskList.push(task);
                }
            }
            else {
                const searchCondition = task.project && task.owner && ((projectId && task.project._id === projectId) || projectId === 'null' && projects.includes(task.project._id));
                if ((category !== "isPersonal" && searchCondition) || projectId === 'null' && isPersonal) {
                    taskList.push(task);
                }
            }
        }
        return taskList;
    }
    async getTaskById(userToken, taskId) {
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ', '')));
        let query = {};
        if (user.role == role_enum_1.Role.Admin) {
            query = { _id: taskId, $or: [{ createdBy: user.id, isPersonal: true }, { owner: user.id }, { isPersonal: false }] };
        }
        else if (user.role === role_enum_1.Role.Manager || user.role === role_enum_1.Role.QA) {
            const projects = await this.projectService.userProjects(user.id);
            query = { _id: taskId, $or: [{ createdBy: user.id }, { owner: user.id }, { project: { $in: projects } }] };
        }
        else {
            query = { _id: taskId, $or: [{ createdBy: user.id }, { owner: user.id }] };
        }
        const task = JSON.parse(JSON.stringify(await this.Task.findOne(query).exec()));
        if (task.project && task.project !== 'none') {
            task['projectList'] = await this.projectService.getProjectList(userToken);
            task['memberList'] = await this.projectService.getProjectMembers(task.project);
        }
        if (task)
            return task;
        else
            throw new common_1.NotFoundException();
    }
    async nextTransission(userToken, taskId) {
        const transission = ['todo', 'inprogress', 'review', 'completed'];
        const user = JSON.parse(await this.redis.get(userToken.replace('Bearer ', '')));
        let query = {};
        if (user.role == role_enum_1.Role.Admin) {
            query = { _id: taskId, $or: [{ createdBy: user.id, isPersonal: true }, { owner: user.id }, { isPersonal: false }] };
        }
        else if (user.role === role_enum_1.Role.Manager || user.role === role_enum_1.Role.QA) {
            const projects = await this.projectService.userProjects(user.id);
            query = { _id: taskId, $or: [{ createdBy: user.id }, { owner: user.id }, { project: { $in: projects } }] };
        }
        else {
            query = { _id: taskId, $or: [{ createdBy: user.id }, { owner: user.id }] };
        }
        const task = await this.Task.findOne(query).exec();
        if (task.transission !== 'completed') {
            task.transission = transission[transission.indexOf(task.transission) + 1];
            await task.save();
            await this.redisTaskUpdateById(taskId);
        }
    }
    async changeTransission(taskTransission) {
        await this.Task.updateOne({ _id: taskTransission.taskId }, { $set: { transission: taskTransission.transission } });
        await this.redisTaskUpdateById(taskTransission.taskId);
    }
    async deleteTask(taskId, userToken) {
        const userRole = JSON.parse(await this.redis.get(userToken.replace('Bearer ', ''))).role;
        if (userRole === "admin" || userRole === "manager") {
            await this.Task.deleteOne({ _id: taskId });
        }
        else {
            await this.Task.deleteOne({ _id: taskId, isPersonal: true });
        }
        this.redis.del(await this.redis.keys('task_*' + taskId));
    }
    async setTasksInRedis() {
        const taskList = await this.Task.find().populate('project', 'title', 'Project').sort({ endDate: 1 }).exec();
        const taskKey = await this.redis.keys('task_*');
        if (taskKey.length)
            await this.redis.del(taskKey);
        taskList.map(async (task) => {
            if (task.isPersonal)
                await this.redis.set('task_personal_' + task.transission + "_" + task.id, JSON.stringify(task));
            else
                await this.redis.set('task_' + task.transission + "_" + task.id, JSON.stringify(task));
        });
    }
    async redisTaskUpdateById(taskId) {
        const task = await this.Task.findById(taskId).populate('project', 'title', 'Project').exec();
        const taskKey = await this.redis.keys('task_*' + task.id, JSON.stringify(task));
        if (taskKey.length)
            await this.redis.del(taskKey);
        if (task.isPersonal)
            await this.redis.set('task_personal_' + task.transission + "_" + task.id, JSON.stringify(task));
        else
            await this.redis.set('task_' + task.transission + "_" + task.id, JSON.stringify(task));
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 5 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskService.prototype, "setTasksInRedis", null);
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Task')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => project_service_1.ProjectService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        project_service_1.ProjectService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map