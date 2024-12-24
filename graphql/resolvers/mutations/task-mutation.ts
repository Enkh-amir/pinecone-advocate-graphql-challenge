import { Task } from '../../models/taskModel';

export const taskMutations = {
  addTask: async (
    _: unknown,
    { taskName, description, priority, tags }: any
  ) => {
    if (description.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
    if (priority < 1 || priority > 5) {
      throw new Error('Priority must be between 1 and 5');
    }

    const newTask = new Task({
      taskName,
      description,
      priority,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await newTask.save();
  },

  updateTask: async (
    _: unknown,
    { taskId, taskName, description, priority, isDone, tags }: any
  ) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    if (taskName) task.taskName = taskName;
    if (description) {
      if (description.length < 10) {
        throw new Error('Description must be at least 10 characters long');
      }
      task.description = description;
    }
    if (priority) {
      if (priority < 1 || priority > 5) {
        throw new Error('Priority must be between 1 and 5');
      }
      task.priority = priority;
    }
    if (isDone !== undefined) task.isDone = isDone;
    if (tags) task.tags = tags;

    task.updatedAt = new Date();
    return await task.save();
  },
};
