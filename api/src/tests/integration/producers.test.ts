import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Producers integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'producers_test';

  before(async () => {
    await populate(dbName);
  });

  it('should get all producers', async () => {
    const GET_PRODUCERS = gql`
      query {
        getProducers {
          name
          description
        }
      }
    `;

    const res = await query({ query: GET_PRODUCERS });
    expect(res.data.getProducers).to.eql([
      {
        name: 'SouthernJams',
        description: 'We are a couple living in Cork, trying to help make the world a more sustainable place. We sell the fruits we grow in our home, both in their natural forms and as delicious homemade jam. We hope you enjoy our products!',
      },
      { name: 'Jorge Saraiva', description: null },
      { name: 'Sara Santos', description: null },
    ]);
  });

  it('should get a specific producer', async () => {
    const GET_PRODUCER = gql`
      query {
        getProducer(key: "80") {
          name
        }
      }
    `;

    const res = await query({ query: GET_PRODUCER });
    expect(res.data.getProducer).to.eql(
      [{ name: 'Jorge Saraiva' }],
    );
  });

  it('should add a producer', async () => {
    const ADD_PRODUCER = gql`
      mutation {
        addProducer(producer: {
          _key: "1234",
          name: "Jonas Brothers",
          description: "We make music. That's it. Nothing to see here.",
        }) {
          name
          description
        }
      }
    `;

    const res = await mutate({ mutation: ADD_PRODUCER });
    expect(res.data.addProducer).to.eql({ name: 'Jonas Brothers', description: "We make music. That's it. Nothing to see here." });
  });

  it('should edit a producer', async () => {
    const EDIT_USER = gql`
      mutation {
        editProducer(producer: {
          _key: "12312313461",
          description: "We are a couple living in Cork, trying to help make the world a more sustainable place. We sell the fruits we grow in our home, both in their natural forms and as delicious homemade jam. We hope you enjoy our products!",
          products: [],
          name: "Banana Splits",
          location: {
            latitude: 53.456785,
            longitude: -6.341236
          }
        }) {
          _key
          name
        }
      }
    `;

    const res = await mutate({ mutation: EDIT_USER });
    expect(res.data.editProducer).to.eql({ _key: '12312313461', name: 'Banana Splits' });
  });

  it('should delete a producer', async () => {
    const DELETE_PRODUCER = gql`
      mutation {
        removeProducer(key: "12312313461") {
          _key
          name
        }
      }
    `;

    const res = await mutate({ mutation: DELETE_PRODUCER });
    expect(res.data.removeProducer).to.eql({ _key: '12312313461', name: 'Banana Splits' });
  });

  after(async () => {
    await dropDB(dbName);
  });
});
