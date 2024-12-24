import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { typeDefs } from "../../graphql/schemas/index";
import { resolvers } from "../../graphql/resolvers";
import { Task } from "../../graphql/models/taskModel";

let testServer: ApolloServer;

describe("Task Queries", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:3000"
    );
    testServer = new ApolloServer({ typeDefs, resolvers });
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    await Task.create([
      {
        taskName: "Task 1",
        description: "Description for Task 1",
        priority: 3,
        isDone: true,
        createdAt: new Date("2024-01-01"),
      },
      {
        taskName: "Task 2",
        description: "Description for Task 2",
        priority: 5,
        isDone: false,
        createdAt: new Date("2024-01-02"),
      },
      {
        taskName: "Task 3",
        description: "Description for Task 3",
        priority: 1,
        isDone: true,
        createdAt: new Date("2024-01-03"),
      },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should retrieve all tasks", async () => {
    const response = await testServer.executeOperation({
      query: `
        query {
          getAllTasks {
            taskName
            description
            priority
            isDone
          }
        }
      `,
    });

    expect(response.errors).toBeUndefined();
    const tasks = response.data?.getAllTasks;
    expect(tasks).toHaveLength(3);
    expect(tasks).toEqual(
      expect.arrayContaining([
        {
          taskName: "Task 1",
          description: "Description for Task 1",
          priority: 3,
          isDone: true,
        },
        {
          taskName: "Task 2",
          description: "Description for Task 2",
          priority: 5,
          isDone: false,
        },
        {
          taskName: "Task 3",
          description: "Description for Task 3",
          priority: 1,
          isDone: true,
        },
      ])
    );
  });

  it("should retrieve tasks marked as done", async () => {
    const response = await testServer.executeOperation({
      query: `
        query {
          getDoneTasksLists {
            taskName
            isDone
          }
        }
      `,
    });

    expect(response.errors).toBeUndefined();
    const tasks = response.data?.getDoneTasksLists;
    expect(tasks).toHaveLength(2);
    expect(tasks).toEqual(
      expect.arrayContaining([
        {
          taskName: "Task 1",
          isDone: true,
        },
        {
          taskName: "Task 3",
          isDone: true,
        },
      ])
    );
  });

  it("should search tasks with filters", async () => {
    const response = await testServer.executeOperation({
      query: `
        query {
          searchTasks(searchTerm: "Task", filters: { priority: 5, isDone: false }) {
            taskName
            priority
            isDone
          }
        }
      `,
    });

    expect(response.errors).toBeUndefined();
    const tasks = response.data?.searchTasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual({
      taskName: "Task 2",
      priority: 5,
      isDone: false,
    });
  });

  it("should search tasks by date range", async () => {
    const response = await testServer.executeOperation({
      query: `
        query {
          searchTasks(filters: { 
            createdAfter: "2024-01-01", 
            createdBefore: "2024-01-03" 
          }) {
            taskName
            createdAt
          }
        }
      `,
    });

    expect(response.errors).toBeUndefined();
    const tasks = response.data?.searchTasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].taskName).toBe("Task 2");
  });
});
// import { taskQueries } from "../../graphql/resolvers/queries/task-querries";
// import { Task } from "../../graphql/models/taskModel";

// // Mock the Task model
// // Mock the Task model
// jest.mock("../../models/taskModel", () => ({
//   Task: {
//     find: jest.fn(),
//   },
// }));

// describe("Task Queries", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getAllTasks", () => {
//     it("should retrieve all tasks successfully", async () => {
//       const mockTasks = [
//         {
//           taskName: "Task 1",
//           description: "Description 1",
//           priority: 3,
//           isDone: false,
//         },
//         {
//           taskName: "Task 2",
//           description: "Description 2",
//           priority: 5,
//           isDone: true,
//         },
//       ];

//       (Task.find as jest.MockedFunction<typeof Task.find>).mockResolvedValue(
//         mockTasks
//       );

//       const result = await taskQueries.getAllTasks();

//       expect(Task.find).toHaveBeenCalledWith();
//       expect(result).toEqual(mockTasks);
//     });
//   });

//   describe("getDoneTasksLists", () => {
//     it("should retrieve all tasks marked as done", async () => {
//       const mockDoneTasks = [
//         {
//           taskName: "Task 2",
//           description: "Description 2",
//           priority: 5,
//           isDone: true,
//         },
//         {
//           taskName: "Task 3",
//           description: "Description 3",
//           priority: 2,
//           isDone: true,
//         },
//       ];

//       (Task.find as jest.MockedFunction<typeof Task.find>).mockResolvedValue(
//         mockDoneTasks
//       );

//       const result = await taskQueries.getDoneTasksLists();

//       expect(Task.find).toHaveBeenCalledWith({ isDone: true });
//       expect(result).toEqual(mockDoneTasks);
//     });
//   });

//   describe("searchTasks", () => {
//     it("should search tasks by taskName (searchTerm)", async () => {
//       const mockSearchResults = [
//         {
//           taskName: "Task 1",
//           description: "Description 1",
//           priority: 3,
//           isDone: false,
//         },
//       ];

//       (Task.find as jest.MockedFunction<typeof Task.find>).mockResolvedValue(
//         mockSearchResults
//       );

//       const result = await taskQueries.searchTasks(
//         {},
//         { searchTerm: "Task 1" }
//       );

//       expect(Task.find).toHaveBeenCalledWith({
//         taskName: { $regex: "Task 1", $options: "i" },
//       });
//       expect(result).toEqual(mockSearchResults);
//     });

//     it("should handle a combination of filters", async () => {
//       const mockFilteredTasks = [
//         {
//           taskName: "Task 5",
//           description: "Description 5",
//           priority: 3,
//           isDone: true,
//         },
//       ];

//       const filters = {
//         priority: 3,
//         isDone: true,
//         createdBefore: "2024-01-01T00:00:00.000Z",
//         createdAfter: "2023-01-01T00:00:00.000Z",
//       };

//       (Task.find as jest.MockedFunction<typeof Task.find>).mockResolvedValue(
//         mockFilteredTasks
//       );

//       const result = await taskQueries.searchTasks({}, { filters });

//       expect(Task.find).toHaveBeenCalledWith({
//         priority: 3,
//         isDone: true,
//         createdAt: {
//           $lt: new Date(filters.createdBefore),
//           $gt: new Date(filters.createdAfter),
//         },
//       });
//       expect(result).toEqual(mockFilteredTasks);
//     });
//   });
// });
