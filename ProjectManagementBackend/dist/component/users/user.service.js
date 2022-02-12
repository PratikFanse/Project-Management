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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const otp_service_1 = require("../../auth/otp/otp.service");
let UserService = class UserService {
    constructor(User, otpService) {
        this.User = User;
        this.otpService = otpService;
    }
    async getUsersList(usersFilter) {
        const query = {};
        if (usersFilter !== 'allUser') {
            query['role'] = usersFilter;
        }
        return await this.User.find(query).select({ email: 1, username: 1, birthDate: 1, role: 1, isActive: 1 }).exec();
    }
    async createNewUser(user) {
        if (!await this.User.findOne({ email: user.email }).exec()) {
            try {
                const passwordHash = await this.encrypt(user.password);
                const newUser = new this.User({
                    email: user.email.toLocaleLowerCase(),
                    username: user.username,
                    password: passwordHash,
                    birthDate: user.dob
                });
                return { isCreated: await newUser.save() ? true : false };
            }
            catch (e) {
                throw new common_1.BadRequestException();
            }
            ;
        }
        else {
            return { isCreated: false, msg: "Email Id already exist!" };
        }
    }
    async setNewPassword(resetPassword) {
        if (await this.validateText(resetPassword.email, resetPassword.userToken)) {
            if (await this.otpService.validateOTP(resetPassword.userToken, resetPassword.otp)) {
                const user = await this.User.findOne({ email: resetPassword.email }).exec();
                user.password = await this.encrypt(resetPassword.newPass);
                try {
                    await user.save();
                    return { isPasswordReset: true };
                }
                catch (e) {
                    throw new common_1.BadRequestException();
                }
            }
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async findOne(email) {
        try {
            let user = await this.User.findOne({ email: email }).exec();
            user = {
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
                birthDate: user.birthDate
            };
            return user;
        }
        catch (e) {
            throw new common_1.NotFoundException();
        }
    }
    async updateUserRole(newRole) {
        this.User.updateOne({ _id: newRole.userId }, { $set: { role: newRole.role } }).exec();
    }
    async encrypt(text) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(text, salt);
    }
    async validateText(text, hash) {
        return await bcrypt.compare(text, hash);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => otp_service_1.OTPService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        otp_service_1.OTPService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map