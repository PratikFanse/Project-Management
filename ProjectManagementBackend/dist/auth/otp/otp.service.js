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
exports.OTPService = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../../component/mail/mail.service");
const redis_model_1 = require("../../component/redis/redis.model");
const user_service_1 = require("../../component/users/user.service");
let OTPService = class OTPService {
    constructor(usersService, mailService) {
        this.usersService = usersService;
        this.mailService = mailService;
        this.redis = new redis_model_1.RedisConnection().getConnection();
    }
    async sendOTP(email) {
        const user = await this.usersService.findOne(email);
        if (user) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const userToken = await this.usersService.encrypt(user.email);
            this.redis.set(userToken, OTP);
            this.redis.expire(userToken, 60 * 5);
            try {
                await this.mailService.sendOTP(user.email, OTP);
            }
            catch (e) {
                throw new common_1.BadGatewayException();
            }
            return userToken;
        }
        else {
            throw new common_1.NotFoundException();
        }
    }
    async validateOTP(userToken, otp) {
        const userOtp = await this.redis.get(userToken);
        if (userOtp && userOtp === userOtp) {
            this.redis.del(userToken);
            return true;
        }
        else {
            throw new common_1.NotFoundException();
        }
    }
};
OTPService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mail_service_1.MailService])
], OTPService);
exports.OTPService = OTPService;
//# sourceMappingURL=otp.service.js.map