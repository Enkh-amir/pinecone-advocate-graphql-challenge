import { graphql } from "graphql";
import mongoose from "mongoose";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../graphql/schemas/index";
import { resolvers } from "../../graphql/resolvers";
import { Task } from "../../graphql/models/taskModel";

const schema = makeExecutableSchema({ typeDefs, resolvers });

describe("Task Mutations", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:3000"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it("should create a new task", async () => {
    const mutation = `
      mutation {
        addTask(
          taskName: "New Task"
          description: "Description that is long enough"
          priority: 1
        ) {
          taskName
          description
          priority
          isDone
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.addTask).toEqual({
      taskName: "New Task",
      description: "Description that is long enough",
      priority: 1,
      isDone: false,
    });
  });

  it("should update an existing task", async () => {
    const task = await Task.create({
      taskName: "Original Task",
      description: "Original Description that is long enough",
      priority: 1,
    });

    const mutation = `
      mutation {
        updateTask(
          taskId: "${task._id}"
          taskName: "Updated Task"
          description: "Updated Description that is long enough"
          priority: 2
          isDone: true
        ) {
          taskName
          description
          priority
          isDone
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateTask).toEqual({
      taskName: "Updated Task",
      description: "Updated Description that is long enough",
      priority: 2,
      isDone: true,
    });
  });

  it("should fail to create task with invalid priority", async () => {
    const mutation = `
      mutation {
        addTask(
          taskName: "Invalid Task"
          description: "Description that is long enough"
          priority: 6
        ) {
          taskName
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
    });

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toContain(
      "Priority must be between 1 and 5"
    );
  });

  it("should fail to create task with short description", async () => {
    const mutation = `
      mutation {
        addTask(
          taskName: "Short Desc"
          description: "Short"
          priority: 1
        ) {
          taskName
        }
      }
    `;

    const result = await graphql({
      schema,
      source: mutation,
    });

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toContain(
      "Description must be at least 10 characters long"
    );
  });
});
