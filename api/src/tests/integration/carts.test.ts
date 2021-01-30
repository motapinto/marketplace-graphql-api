import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Carts integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'carts_test';

  before(async () => {
    await populate(dbName);
  });

  it('should get a buyers cart', async () => {
    const GET_CART = gql`
      query {
        buyer(key: "1") {
          _key
          name
          cart {
            list {
              _key,
              product {
                _key
                name
              }
              quantity
            }
          }
        }
      }
    `;
    const res = await query({ query: GET_CART });
    expect(res.data.buyer.cart.list.length).to.eql(2);
  });

  it('should get a buyers cart correct total price', async () => {
    const GET_CART = gql`
      query {
        buyer(key: "1") {
          cart {
            price
          }
        }
      }
    `;
    const res = await query({ query: GET_CART });
    expect(res.data.buyer.cart.price).to.eql(37.5);
  });

  it('should update a product quantity in the cart', async () => {
    const UPDATE_CART = gql`
      mutation {
        updateCart(cart: {
          _key: "004"
          productKey: "115"
          buyerKey: "1"
          quantity: 7
        }) {
          list {
              _key,
              product {
                _key
                name
              }
              quantity
            }
        }
      }
    `;
    const res = await mutate({ mutation: UPDATE_CART });
    expect(res.data.updateCart.list[1].quantity).to.eql(7);
  });

  it('should delete a product from the cart', async () => {
    const UPDATE_CART = gql`
      mutation {
        updateCart(cart: {
          _key: "004"
          productKey: "115"
          buyerKey: "1"
          quantity: 0
        }) {
          list {
              _key,
              product {
                _key
                name
              }
              quantity
            }
        }
      }
    `;
    const res = await mutate({ mutation: UPDATE_CART });
    expect(res.data.updateCart.list.length).to.eql(1);
  });

  it('should add a product from the cart', async () => {
    const UPDATE_CART = gql`
      mutation {
        updateCart(cart: {
          productKey: "115"
          buyerKey: "1"
          quantity: 5
        }) {
          list {
              _key,
              product {
                _key
                name
              }
              quantity
            }
        }
      }
    `;
    const res = await mutate({ mutation: UPDATE_CART });
    expect(res.data.updateCart.list.length).to.eql(2);
  });

  after(async () => {
    await dropDB(dbName);
  });
});
