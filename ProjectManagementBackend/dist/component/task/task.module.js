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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const task_model_1 = require("./models/task.model");
const mongoose_1 = require("@nestjs/mongoose");
const task_service_1 = require("./task.service");
const task_controller_1 = require("./task.controller");
const project_module_1 = require("../project/project.module");
let TaskModule = class TaskModule {
    constructor() { }
};
TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Task', schema: task_model_1.TaskScema }]),
            project_module_1.ProjectModule
        ],
        providers: [task_service_1.TaskService],
        exports: [task_service_1.TaskService],
        controllers: [task_controller_1.TaskController],
    }),
    __metadata("design:paramtypes", [])
], TaskModule);
exports.TaskModule = TaskModule;
//# sourceMappingURL=task.module.js.map