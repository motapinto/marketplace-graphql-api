import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Users integration tests', async () => {
  const { query } = await server.value;
  const dbName = 'users_test';
  const commonArgs = `
    _key
    name
    phone
    email
    birthday
    address
    photo {
      dataLocation
    }
    banner {
      dataLocation
    }
  `;
  const producerArgs = `
    products {
      _key
      name
      description
      price
      stock
      images {
        dataLocation
      }
      reviews {
        comment
        rating
        date
      }
    }
  `;
  const buyerArgs = `
    points
    orders {
      _key
      product { _key }
      price
      quantity
      date
    }
    reviews {
      comment
      rating
      date
    }
    categories {
      name
    }
  `;

  before(async () => {
    await populate(dbName);
  });

  it('should get all users', async () => {
    const GET_USERS = gql`
      query {
        users {
          ... on ProducerType {
            ${commonArgs}
            ${producerArgs}
          }

          ... on BuyerType {
            ${commonArgs}
            ${buyerArgs}
          }
        }
      }
    `;

    const res = await query({ query: GET_USERS });
    expect(res.data.users.length).to.eql(5);
  });

  after(async () => {
    await dropDB(dbName);
  });
});
