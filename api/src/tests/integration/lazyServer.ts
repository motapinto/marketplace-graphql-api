import { buildSchema } from 'type-graphql';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { Lazy } from '../utils/lazy';
import UserResolver from '../../graphql/resolvers/UserResolver';
import BuyerResolver from '../../graphql/resolvers/BuyerResolver';
import ProducerResolver from '../../graphql/resolvers/ProducerResolver';
import ProductResolver from '../../graphql/resolvers/ProductResolver';
import CategoryResolver from '../../graphql/resolvers/CategoryResolver';
import ReviewResolver from '../../graphql/resolvers/ReviewResolver';
import ProductSortResolver from '../../graphql/args/ProductSort';
// import OrderResolver from './graphql/resolvers/OrderResolver';
// import CartResolver from './graphql/resolvers/CartResolver';
// import PurchasesResolver from './graphql/resolvers/PurchasesResolver';

async function buildServer() {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      BuyerResolver,
      ProducerResolver,
      ProductResolver,
      CategoryResolver,
      ReviewResolver,
      ProductSortResolver,
      // OrderResolver,
      // CartResolver,
      // PurchasesResolver,
    ],
  });

  return createTestClient(new ApolloServer({ schema }));
}

const server = new Lazy(buildServer);

export default server;