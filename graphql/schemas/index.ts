import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Task {
    _id: ID!
    taskName: String!
    description: String!
    isDone: Boolean!
    priority: Int!
    tags: [String!]
    createdAt: String!
    updatedAt: String!
  }

  input TaskFilterInput {
    priority: Int
    isDone: Boolean
    createdBefore: String
    createdAfter: String
  }

  type Query {
    getAllTasks: [Task!]!
    getDoneTasksLists: [Task!]!
    searchTasks(searchTerm: String!, filters: TaskFilterInput): [Task!]!
  }

  type Mutation {
    addTask(
      taskName: String!
      description: String!
      priority: Int!
      tags: [String]
    ): Task!
    updateTask(
      taskId: ID!
      taskName: String
      description: String
      priority: Int
      isDone: Boolean
      tags: [String]
    ): Task!
  }
`;
