import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Categories integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'categories_test';
  const returnArgs = `
    _key
    name
  `;

  before(async () => {
    await populate(dbName);
  });

  it('should get all categories ', async () => {
    const GET_CATEGORIES = gql`
      query {
        categories {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_CATEGORIES });    
    expect(res.data.categories.length).to.eql(9);
  });

  it('should get a category', async () => {
    const GET_CATEGORY = gql`
      query {
        category(key: "1") {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_CATEGORY });
    expect(res.data.category.name).to.eql('honey');
  });

  it('should add a category', async () => {
    const ADD_CATEGORY = gql`
      mutation {
        addCategory(category: { name: "Chips" } ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: ADD_CATEGORY });
    expect(res.data.addCategory.name).to.eql('Chips');
  });

  it('should remove a category', async () => {
    const REMOVE_CATEGORY = gql`
      mutation {
        removeCategory(key: "1") {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_CATEGORY });
    expect(res.data.removeCategory.name).to.eql('honey');
  });

  it('should update a category', async () => {
    const UPDATE_CATEGORY = gql`
      mutation {
        updateCategory(category:{_key: "2", name: "water"}) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_CATEGORY });
    expect(res.data.updateCategory.name).to.eql('water');
  });

  after(async () => {
    await dropDB(dbName);
  });
});
