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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../../auth/role/role.enum");
const roles_decorator_1 = require("../../auth/role/roles.decorator");
const task_service_1 = require("./task.service");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    async addNewTask(newTask, req) {
        return this.taskService.createNewTask(newTask, req.headers.authorization);
    }
    async updateTask(task, req) {
        return this.taskService.updateTask(task, req.headers.authorization);
    }
    getAllTask(req, projectId) {
        return this.taskService.getTaskListByCategory(req.headers.authorization, 'allTask', projectId);
    }
    getTaskListByCategory(req, category, projectId) {
        return this.taskService.getTaskListByCategory(req.headers.authorization, category, projectId);
    }
    getTaskById(req, id) {
        return this.taskService.getTaskById(req.headers.authorization, id);
    }
    nextTrasition(req, taskId) {
        return this.taskService.nextTrasition(req.headers.authorization, taskId);
    }
    changeTrasition(task) {
        return this.taskService.changeTrasition(task);
    }
    deleteTask(taskId, req) {
        return this.taskService.deleteTask(taskId, req.headers.authorization);
    }
};
__decorate([
    (0, common_1.Post)('addNewTask'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "addNewTask", null);
__decorate([
    (0, common_1.Post)('updateTask'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Get)('getAllTask/:projectId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllTask", null);
__decorate([
    (0, common_1.Get)('getTaskListByCategory/:category/:projectId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('category')),
    __param(2, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getTaskListByCategory", null);
__decorate([
    (0, common_1.Get)('getTaskById/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Put)('nextTrasition/:taskId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "nextTrasition", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.QA),
    (0, common_1.Put)('changeTrasition'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "changeTrasition", null);
__decorate([
    (0, common_1.Delete)('deleteTask/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteTask", null);
TaskController = __decorate([
    (0, common_1.Controller)('task'),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map