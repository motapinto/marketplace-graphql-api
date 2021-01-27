import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Carts integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'carts_test';

  before(async () => {
    await populate(dbName);
  });/*

  it('should get a user\'s cart', async () => {
    const GET_CART_BY_USER = gql`
    query {
        getCartByUser(key:"4670"){
          user{
            _key
            name
          }
          list{
            product{
              _key
             }
           quantity
           }
        }
    }`;
    const res = await query({ query: GET_CART_BY_USER });
    expect(res.data.getCartByUser).to.eql(
      {
        user,
        list: [{ product: { _key: '111' }, quantity: 10 }],
      },
    );
  });

  it('should add an item to a user\'s cart', async () => {
    const ADD_ITEM_TO_CART = gql`
    mutation{
        addItemToCart(cartItem:{userKey:"4670", quantity:100, product:
            {
                _key: "112",
                name: "Honey 2.0",
                price: 7.5,
            }}){
            _key
            user{_key, name}
            list{product{_key}, quantity}
        }
      }`;

    await mutate({ mutation: ADD_ITEM_TO_CART });
    const GET_CART_BY_USER = gql`
    query {
        getCartByUser(key:"4670"){
            user{
                _key
                name
            }
            list{
                product{ _key }
                quantity
            }
        }
    }`;
    const res = await query({ query: GET_CART_BY_USER });
    expect(res.data.getCartByUser).to.eql(
      {
        user,
        list: [{ product: { _key: '111' }, quantity: 10 }, { product: { _key: '112' }, quantity: 100 }],
      },
    );
  });

  it('should increase the quantity of an item in a user\'s cart', async () => {
    const ADD_ITEM_TO_CART = gql`
    mutation{
      addItemToCart(cartItem:{userKey:"4670", quantity:100, product:
          {
              _key: "111",
              name: "Honey 1.0",
              price: 2.5,
          }}){
          _key
          user{_key, name}
          list{product{_key}, quantity}
      }
    }`;
    await mutate({ mutation: ADD_ITEM_TO_CART });

    const GET_CART_BY_USER = gql`
    query {
        getCartByUser(key:"4670"){
          user{
              _key
              name
          }
          list{
              product{
                _key
            }
              quantity
          }
        }
      }`;
    const res = await query({ query: GET_CART_BY_USER });
    expect(res.data.getCartByUser).to.eql(
      {
        user,
        list: [{ product: { _key: '111' }, quantity: 110 }, { product: { _key: '112' }, quantity: 100 }],
      },
    );
  });

  it('should decrease the quantity of an item in a user\'s cart', async () => {
    const DECREASE_ITEM_QUANTITY = gql`
    mutation{
        decreaseItemQuantity(cartInfo:{userKey:"4670", product:"111"}){
          _key
          user{_key, name}
          list{product{_key}, quantity}
        }
    }`;

    await mutate({ mutation: DECREASE_ITEM_QUANTITY });
    const GET_CART_BY_USER = gql`
    query {
        getCartByUser(key:"4670"){
          user{
            _key
            name
          }
          list{
            product{
              _key
            }
            quantity
          }
        }
      }`;
    const res = await query({ query: GET_CART_BY_USER });
    expect(res.data.getCartByUser).to.eql(
      {
        user,
        list: [{ product: { _key: '111' }, quantity: 109 }, { product: { _key: '112' }, quantity: 100 }],
      },
    );
  });

  it('should remove an item from a user\'s cart', async () => {
    const GET_CART_BY_USER = gql`
    query {
        getCartByUser(key:"4670"){
          user{
            _key
            name
          }
          list{
            product{
              _key
            }
            quantity
          }
        }
    }`;
    await query({ query: GET_CART_BY_USER });
    const REMOVE_ITEM = gql`
    mutation{removeItemFromCart(cartInfo:{userKey:"4670", product:"111"}){
            _key
            user{_key, name}
            list{product{_key}, quantity}
        }
    }`;
    await mutate({ mutation: REMOVE_ITEM });
    const res = await query({ query: GET_CART_BY_USER });
    expect(res.data.getCartByUser).to.eql(
      {
        user,
        list: [
          {
            product: {
              _key: '112',
            },
            quantity: 100,
          },
        ],
      },
    );
  });

  it('should check that after an item\'s quantity has been reduced to 0 the item is removed from the user\'s cart', async () => {
    const ADD_ITEM_TO_CART = gql`
    mutation{
        addItemToCart(cartItem:{userKey:"4670", quantity:1, product:
            {
                _key: "113",
                name: "Honey 1.0",
                price:2.5,
            }}){
          _key
          user{_key, name}
        list{product{_key}, quantity}
       }
    }`;
    await query({ query: ADD_ITEM_TO_CART });

    const GET_CART_BY_USER = gql`
    query {
        getCartByUser(key:"4670"){
          user{
            _key
            name
          }
          list{
            product{
              _key
             }
           quantity
           }
        }
    }`;
    const res1 = await query({ query: GET_CART_BY_USER });
    expect(res1.data.getCartByUser).to.eql(
      {
        user,
        list: [{ product: { _key: '112' }, quantity: 100 }, { product: { _key: '113' }, quantity: 1 }],
      },
    );
    const DECREASE_ITEM_QUANTITY = gql`
    mutation{
        decreaseItemQuantity(cartInfo:{userKey:"4670", product:"113"}){
          _key
          user{_key, name}
          list{product{_key}, quantity}
        }
    }`;

    await mutate({ mutation: DECREASE_ITEM_QUANTITY });
    const res2 = await query({ query: GET_CART_BY_USER });
    expect(res2.data.getCartByUser).to.eql(
      {
        user,
        list: [{ product: { _key: '112' }, quantity: 100 }],
      },
    );
  }); */

  after(async () => {
    await dropDB(dbName);
  });
});
