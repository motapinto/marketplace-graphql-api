import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Orders integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'orders_test';

  before(async () => {
    await populate(dbName);
  });

  it('should add an order', async () => {
    const ADD_ORDER = gql`
      mutation {
        addOrder(order: { productKey: "111", buyerKey: "1", quantity: 3 }) {
          _key
          product {
            name
            price
          }
          quantity
          date
          price
        }
      }
    `;

    const res = await mutate({ mutation: ADD_ORDER });
    expect(res.data.addOrder.price).to.eql(7.5);
  });

  it('should remove an order', async () => {
    const REMOVE_ORDER = gql`
      mutation {
        removeOrder(key: "002") {
          _key
          quantity
          date
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_ORDER });
    expect(res.data.removeOrder.quantity).to.eql(12);
  });

  after(async () => {
    await dropDB(dbName);
  });
});
