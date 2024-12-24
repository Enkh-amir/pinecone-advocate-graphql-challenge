import mongoose, { Schema, Document } from "mongoose";

export interface TaskDocument extends Document {
  taskName: string;
  description: string;
  isDone: boolean;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  taskName: { type: String, required: true },
  description: { type: String, required: true, minlength: 10 },
  isDone: { type: Boolean, default: false },
  priority: { type: Number, required: true, min: 1, max: 5 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Task = mongoose.model<TaskDocument>("Task", TaskSchema);
