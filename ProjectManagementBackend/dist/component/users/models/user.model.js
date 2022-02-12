"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserScema = void 0;
const mongoose = require("mongoose");
exports.UserScema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    role: { type: String, required: true, enum: ['admin', 'manager', 'QA', 'employee', 'none'], default: 'employee' },
    isActive: Boolean,
    acceptedBy: { type: Object, ref: 'User' },
    deletedAt: Date,
    deletedBy: { type: Object, ref: 'User' }
}, { timestamps: true });
//# sourceMappingURL=user.model.js.map