"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectScema = void 0;
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
exports.ProjectScema = new mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    members: [{ type: Object, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    deletedAt: Date,
    owner: { type: Object, ref: 'User', required: true },
    deletedBy: { type: Object, ref: 'User' }
}, { timestamps: true });
//# sourceMappingURL=project.model.js.map