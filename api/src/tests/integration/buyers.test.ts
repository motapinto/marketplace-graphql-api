import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Buyers integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'buyers_test';
  const returnArgs = `
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
    points
    orders {
      _key
      product { _key }
      buyer { _key }
      price
      units
      date
      eta
      inProgress
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

  it('should get all buyers ', async () => {
    const GET_BUYERS = gql`
      query {
        buyers {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_BUYERS });
    expect(res.data.buyers.length).to.eql(2);
  });

  it('should get a buyer', async () => {
    const GET_BUYER = gql`
      query {
        buyer(key: "1") {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_BUYER });
    expect(res.data.buyer.name).to.eql('Martim Pinto da Silva');
    expect(res.data.buyer.categories).to.eql([{ name: 'honey' }, { name: 'cookies' }]);
  });

  it('should add a buyers', async () => {
    const ADD_BUYER = gql`
      mutation {
        addBuyer(
          buyer: {
            name: "Test Buyer"
            phone: "+351919191910"
            photo: { dataLocation: "stock" }
            banner: { dataLocation: "stock" }
            email: "test@example.com",
            birthday: "01-01-1999",
            address: "Rua Exemplo, nº 1001",
            categories: [{_key: "2", name: "milk"}] 
          }
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: ADD_BUYER });
    expect(res.data.addBuyer.name).to.eql('Test Buyer');
  });

  it('should remove a buyer', async () => {
    const REMOVE_BUYER = gql`
      mutation {
        removeBuyer(key: "1") {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_BUYER });
    expect(res.data.removeBuyer.name).to.eql('Martim Pinto da Silva');
  });

  it('should update a buyer', async () => {
    const UPDATE_BUYER = gql`
      mutation {
        updateBuyer(
          buyer: {
            _key: "2"
            name: "John Travolta"
            categories: [{_key: "2", name: "milk"}] 
          }
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_BUYER });
    expect(res.data.updateBuyer.name).to.eql('John Travolta');
  });

  after(async () => {
    await dropDB(dbName);
  });
});
