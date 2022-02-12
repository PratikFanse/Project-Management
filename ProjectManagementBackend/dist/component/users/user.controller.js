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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../auth/auth.service");
const role_enum_1 = require("../../auth/role/role.enum");
const roles_decorator_1 = require("../../auth/role/roles.decorator");
const roles_guard_1 = require("../../auth/role/roles.guard");
const user_service_1 = require("./user.service");
const otp_service_1 = require("../../auth/otp/otp.service");
const resetPassword_model_1 = require("./models/resetPassword.model");
const newUser_model_1 = require("./models/newUser.model");
const redis_model_1 = require("../redis/redis.model");
let UserController = class UserController {
    constructor(authService, userService, otpService) {
        this.authService = authService;
        this.userService = userService;
        this.otpService = otpService;
        this.redis = new redis_model_1.RedisConnection().getConnection();
    }
    createUser(newUser) {
        return this.userService.createNewUser(newUser);
    }
    async login(req, res) {
        const user = await this.authService.validateUser(req.body.email, req.body.password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const access_token = this.authService.login(user).access_token;
        this.redis.set(access_token, JSON.stringify(user));
        this.redis.expire(access_token, 60 * 60);
        res.cookie("access_token", access_token, { maxAge: 60 * 60 * 1000 });
        return access_token;
    }
    logout(res, req) {
        this.redis.del(req.headers.authorization.replace('Bearer ', ''));
        res.clearCookie("access_token");
        return true;
    }
    getProfile(req) {
        return req.user;
    }
    getUsersList(usersFilter) {
        return this.userService.getUsersList(usersFilter);
    }
    sendOtpServices(req) {
        return this.otpService.sendOTP(req.body.email);
    }
    setNewPassword(resetPassword) {
        return this.userService.setNewPassword(resetPassword);
    }
    signUp(newUser) {
        return this.userService.createNewUser(newUser);
    }
    updateUserRole(newRole) {
        return this.userService.updateUserRole(newRole);
    }
};
__decorate([
    (0, common_1.Post)('signin'),
    (0, roles_guard_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createUser", null);
__decorate([
    (0, roles_guard_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, roles_guard_1.Public)(),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Get)('getUsersList/:usersFilter'),
    __param(0, (0, common_1.Param)('usersFilter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUsersList", null);
__decorate([
    (0, roles_guard_1.Public)(),
    (0, common_1.Post)('forgotPassword'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "sendOtpServices", null);
__decorate([
    (0, roles_guard_1.Public)(),
    (0, common_1.Post)('resetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_model_1.ResetPassword]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setNewPassword", null);
__decorate([
    (0, roles_guard_1.Public)(),
    (0, common_1.Post)('signUp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newUser_model_1.NewUser]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "signUp", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Put)('updateUserRole'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUserRole", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, user_service_1.UserService, otp_service_1.OTPService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map