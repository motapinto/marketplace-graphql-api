import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Producers integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'producers_test';
  const returnArgs = `
    _key
    name
    description
    location {
      latitude
      longitude
    }
    banner {
      dataLocation
    }
    photo {
      dataLocation
    }
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

  before(async () => {
    await populate(dbName);
  });

  it('should get all producers', async () => {
    const GET_PRODUCERS = gql`
      query {
        producers {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCERS });
    expect(res.data.producers.length).to.eql(3);
  });

  it('should get a producer', async () => {
    const GET_PRODUCER = gql`
      query {
        producer(key: "1") {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCER });    
    expect(res.data.producer.name).to.eql('Sophie Austin');
    expect(res.data.producer.products.length).to.eql(3);
  });

  it('should add a producer', async () => {
    const ADD_PRODUCER = gql`
      mutation {
        addProducer(
          producer: {
            name: "Test Producer"
            description: "Test description"
            phone: "+351919191910"
            photo: { dataLocation: "stock" }
            banner: { dataLocation: "stock" }
            email: "test@example.com"
            birthday: "01-01-1999"
            address: "Rua Exemplo, nº 1001"
            location: { latitude: 53.347229, longitude: -6.266593 }
          }
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: ADD_PRODUCER });
    expect(res.data.addProducer.name).to.eql('Test Producer');
  });

  it('should delete a producer', async () => {
    const REMOVE_PRODUCER = gql`
      mutation {
        removeProducer(key: "1") {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_PRODUCER });
    expect(res.data.removeProducer.name).to.eql('Sophie Austin');
  });

  it('should update a producer', async () => {
    const UPDATE_USER = gql`
      mutation {
        updateProducer(
          producer: {
            _key: "3"
            name: "Arlo Jameson"
          }
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_USER });
    expect(res.data.updateProducer.name).to.eql('Arlo Jameson');
  });

  after(async () => {
    await dropDB(dbName);
  });
});
