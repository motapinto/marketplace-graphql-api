import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Users integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'users_test';

  before(async () => {
    await populate(dbName);
  });

  it('should add a user', async () => {
    const ADD_USER = gql`
      mutation {
        addUser(user: {
          _key: "27",
          name: "James"
        }) {
          _key
          name
        }
      }
    `;

    const res = await mutate({ mutation: ADD_USER });
    expect(res.data.addUser).to.eql({ _key: '27', name: 'James' });
  });

  it('should edit a user', async () => {
    const EDIT_USER = gql`
      mutation {
        editUser(user: {_key: "27", name: "Paulo"}) {
          _key
          name
        }
      }
    `;

    const res = await mutate({ mutation: EDIT_USER });
    expect(res.data.editUser).to.eql({ _key: '27', name: 'Paulo' });
  });

  it('should delete a user', async () => {
    const DELETE_USER = gql`
      mutation {
        removeUser(key: "27") {
          _key
          name
        }
      }
    `;

    const res = await mutate({ mutation: DELETE_USER });
    expect(res.data.removeUser).to.eql({ _key: '27', name: 'Paulo' });
  });

  after(async () => {
    await dropDB(dbName);
  });
});
