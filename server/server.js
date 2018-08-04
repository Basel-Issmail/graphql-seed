import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import { userDefs, userResolvers } from './models/user/user.graphql';

const app = express();

// db.url is different depending on NODE_ENV
mongoose.connect(config.db.url, { useNewUrlParser: true });

const server = new ApolloServer({
  typeDefs: [userDefs],
  resolvers: [userResolvers],
  context: ({ req }) => ({
    SECRET: config.SECRET,
    req,
  }),
});

// MiddleWare
server.applyMiddleware({ app });

export { app, server };
