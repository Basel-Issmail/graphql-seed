import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { gql } from 'apollo-server-express';
import _ from 'lodash';
import { checkRolesAndResolve } from '../resolvers.graphql';
import Users from './user.model';
import getAllUsers from './user.ctrl';

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
  
  input RegisterInput {
    username: String!
    password: String!
    name: String
    role: Role
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    registerUser(input: RegisterInput): User!
    loginUser(input: LoginInput): String!
  }

`;

// Provide resolver functions for your schema fields
const userResolvers = {
  Query: {
    allUsers: (root, input, context) => checkRolesAndResolve(context, ['ADMIN'], getAllUsers),
  },
  Mutation: {
    registerUser: async (root, { input }) => {
      const hashCost = 10;
      try {
        const passwordHash = await bcrypt.hash(input.password, hashCost);
        const newUser = new Users({
          username: input.username, password: passwordHash, name: input.name, role: input.role,
        });
        await newUser.save();
        return newUser;
      } catch (error) {
        return error;
      }
    },
    loginUser: async (root, { input }, { SECRET }) => {
      const user = await Users.findOne({ username: input.username });
      if (!user) {
        throw new Error('Username is not correct');
      }
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new Error('Incorrect Password');
      }

      const token = jwt.sign(
        {
          user: _.pick(user, ['id', 'role']),
        },
        SECRET,
        {
          expiresIn: '1y',
        },
      );

      return token;
    },
  },
};

export { userDefs, userResolvers };
