"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskScema = void 0;
const mongoose = require("mongoose");
exports.TaskScema = new mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    owner: { type: Object, ref: 'User' },
    isPersonal: { type: Boolean, default: true },
    project: { type: Object, ref: 'Project' },
    transission: { type: String, enum: ['todo', 'inprogress', 'review', 'completed'], default: 'todo' },
    isActive: { type: Boolean, default: true },
    deletedAt: Date,
    createdBy: { type: Object, ref: 'User' },
    deletedBy: { type: Object, ref: 'User' }
}, { timestamps: true });
//# sourceMappingURL=task.model.js.map