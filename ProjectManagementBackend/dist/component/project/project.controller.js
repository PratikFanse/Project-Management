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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../../auth/role/role.enum");
const roles_decorator_1 = require("../../auth/role/roles.decorator");
const project_service_1 = require("./project.service");
let ProjectController = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }
    createProject(project, req) {
        this.projectService.createProject(project, req.headers.authorization);
    }
    getProjectList(req) {
        return this.projectService.getProjectList(req.headers.authorization);
    }
    getProjectMembers(projectId) {
        return this.projectService.getProjectMembers(projectId);
    }
    getProject(projectId, req) {
        return this.projectService.getProject(projectId, req.headers.authorization);
    }
    updateProject(project) {
        this.projectService.updateProject(project);
    }
};
__decorate([
    (0, common_1.Post)('createProject'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "createProject", null);
__decorate([
    (0, common_1.Get)('getProjectList'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProjectList", null);
__decorate([
    (0, common_1.Get)('getProjectMembers/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProjectMembers", null);
__decorate([
    (0, common_1.Get)('getProject/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProject", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Manager),
    (0, common_1.Put)('updateProject'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "updateProject", null);
ProjectController = __decorate([
    (0, common_1.Controller)('project'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map