import express from 'express';
import dotenv from 'dotenv';
import * as path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import database from './database/db';
import UserResolver from './graphql/resolvers/UserResolver';
import BuyerResolver from './graphql/resolvers/BuyerResolver';
import ProducerResolver from './graphql/resolvers/ProducerResolver';
import ProductResolver from './graphql/resolvers/ProductResolver';
import CategoryResolver from './graphql/resolvers/CategoryResolver';
import ReviewResolver from './graphql/resolvers/ReviewResolver';
import ProductSortResolver from './graphql/args/ProductSort';
import CartResolver from './graphql/resolvers/CartResolver';
import OrderResolver from './graphql/resolvers/OrderResolver';

(async () => {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      BuyerResolver,
      ProducerResolver,
      ProductResolver,
      CategoryResolver,
      ReviewResolver,
      ProductSortResolver,
      CartResolver,
      OrderResolver,
    ],
  });

  const server = new ApolloServer({
    schema,
    playground: true,
  });

  dotenv.config();
  await database.initialize({
    dbURL: process.env.DATABASE_URL || 'http://localhost:8529',
    dbUser: process.env.DATABASE_USER || 'root',
    dbPass: process.env.DATABASE_PASS || 'rootpassword',
    dbName: process.env.DATABASE_NAME || 'realfarmville',
  });

  const app = express();
  server.applyMiddleware({ app });
  app.use('/assets', express.static(path.resolve(__dirname, 'public')));
  app.listen({ port: process.env.PORT || 5000 }, () => {
    console.log('Listening on port 5000'); // eslint-disable-line
  });
})();
