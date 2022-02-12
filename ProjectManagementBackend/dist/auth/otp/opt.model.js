"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPSchema = void 0;
const mongoose = require("mongoose");
exports.OTPSchema = new mongoose.Schema({
    otp: { type: String, required: true },
    expireIn: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    userToken: { type: String, required: true }
}, { timestamps: true });
//# sourceMappingURL=opt.model.js.map