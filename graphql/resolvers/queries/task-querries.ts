import { Task } from "../../models/taskModel";

export const taskQueries = {
  getAllTasks: async () => {
    try {
      return await Task.find({})
        .select("taskName description isDone priority tags createdAt updatedAt")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch tasks: `);
    }
  },

  getDoneTasksLists: async () => {
    try {
      return await Task.find({ isDone: true })
        .select("taskName description isDone priority tags createdAt updatedAt")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch done tasks:`);
    }
  },

  searchTasks: async (_: unknown, { searchTerm = "", filters }: any) => {
    try {
      const query: any = {};

      // Handle search term
      if (searchTerm.trim()) {
        query.$or = [
          { taskName: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ];
      }

      // Handle filters
      if (filters) {
        if (filters.priority) {
          if (Array.isArray(filters.priority)) {
            query.priority = { $in: filters.priority };
          } else {
            query.priority = filters.priority;
          }
        }

        if (filters.isDone !== undefined) {
          query.isDone = filters.isDone;
        }

        if (filters.tags && filters.tags.length > 0) {
          query.tags = { $all: filters.tags };
        }

        // Handle date range
        if (filters.createdBefore || filters.createdAfter) {
          query.createdAt = {};
          if (filters.createdBefore) {
            query.createdAt.$lte = new Date(filters.createdBefore);
          }
          if (filters.createdAfter) {
            query.createdAt.$gte = new Date(filters.createdAfter);
          }
        }
      }

      return await Task.find(query)
        .select("taskName description isDone priority tags createdAt updatedAt")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to search tasks:`);
    }
  },
};
