import { taskMutations } from "../resolvers/mutations/task-mutation";
import { taskQueries } from "../resolvers/queries/task-querries";

export const resolvers = {
  Query: {
    ...taskQueries,
  },
  Mutation: {
    ...taskMutations,
  },
};
