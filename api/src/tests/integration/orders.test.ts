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

  it('should get the right order', async () => {
    const GET_ORDER = gql`
            query {
                order(key: "1") {
                        _key
                        price
                        units
                    }
                }
            `;

    const response = await query({ query: GET_ORDER });
    expect(response.data.order).to.eql({ _key: '1', price: 20, units: 2 });
  });

  it('should get the order\'s product', async () => {
    const GET_ORDER_PRODUCT = gql`
            query {
                order(key: "1") {
                        _key
                        product {
                            name
                        }
                    }
                }
            `;

    const response = await query({ query: GET_ORDER_PRODUCT });
    expect(response.data.order).to.eql({ _key: '1', product: { name: 'Honey 1.0' } });
  });

  after(async () => {
    await dropDB(dbName);
  });
});
