import dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { Database } from 'arangojs';
import database from './db';
// resolvers
import ProductResolver from '../graphql/resolvers/ProductResolver';
import UserResolver from '../graphql/resolvers/UserResolver';
import BuyerResolver from '../graphql/resolvers/BuyerResolver';
import ProducerResolver from '../graphql/resolvers/ProducerResolver';
import ProductSortResolver from '../graphql/args/ProductSort';
import CategoryResolver from '../graphql/resolvers/CategoryResolver';
import ReviewResolver from '../graphql/resolvers/ReviewResolver';
import OrderResolver from '../graphql/resolvers/OrderResolver';
import CartResolver from '../graphql/resolvers/CartResolver';
// populate
import addProducts from './populate/products';
import addBuyers from './populate/buyers';
import addProducers from './populate/producers';
import addSorts from './populate/sorts';
import addCategories from './populate/categories';
import addReviews from './populate/reviews';
import addCarts from './populate/carts';
import addOrders from './populate/orders';

interface ArangoDB {
  dbURL: string
  dbUser: string
  dbPass: string
  dbName: string
}

dotenv.config();
const dbObj: ArangoDB = {
  dbURL: process.env.DATABASE_URL || 'http://localhost:8529',
  dbUser: process.env.DATABASE_USER || 'root',
  dbPass: process.env.DATABASE_PASS || 'rootpassword',
  dbName: process.env.DATABASE_NAME || 'farmland',
};

export const dropDB = async (dbName: string = process.env.DATABASE_NAME || 'farmland') => {
  const systemDB = new Database({
    url: dbObj.dbURL,
    auth: {
      username: dbObj.dbUser,
      password: dbObj.dbPass,
    },
  });
  
  const names = await systemDB.listDatabases();
  if (names.indexOf(dbName) !== -1) {
    await systemDB.dropDatabase(dbName);
  }

  return systemDB;
};

export const populate = async (dbName: string = process.env.DATABASE_NAME || 'farmland') => {
  await buildSchema({
    resolvers: [
      ProductResolver,
      UserResolver,
      BuyerResolver,
      ProducerResolver,
      ProductSortResolver,
      CategoryResolver,
      ReviewResolver,
      OrderResolver,
      CartResolver,
    ],
  });

  
  dbObj.dbName = dbName;
  await dropDB(dbName);
  const db = await database.initialize(dbObj);  

  await addSorts(db);
  await addCategories();
  await addProducers();
  await addBuyers();
  await addProducts();

  // Waits for products_view to build
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const cursor = await db.query('FOR p in products_view return p');
    // eslint-disable-next-line no-await-in-loop
    const productsData = await cursor.all();
    if (productsData && productsData.length > 0) break;
  }

  await addReviews();
  await addCarts();
  await addOrders();

  return db;
};
