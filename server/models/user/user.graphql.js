import { gql } from 'apollo-server-express';
import Users from './user.model';

// Construct a schema, using GraphQL schema language
const userDefs = gql`
 type User {
    id: ID
    name: String
    role: Role
  }

  enum Role {
      ADMIN
      USER
  }

  type Query {
    allUsers: [User]
  }

`;

// Provide resolver functions for your schema fields
const userResolvers = {
  Query: {
    allUsers: () => Users.find(),
  },
  Mutation: {

  },
};

export { userDefs, userResolvers };
