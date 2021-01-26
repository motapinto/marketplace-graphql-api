import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Products integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'products_test';

  before(async () => {
    await populate(dbName);
  });

  const honey20Alt = 'Honey 2.0*';
  const veryNiceHoney = 'Very nice honey';

  it('should get all products', async () => {
    const GET_PRODUCTS = gql`
      query {
        products {
          _key,
          name,
        }
      }
    `;

    const response = await query({ query: GET_PRODUCTS });
    expect(response.data.products).to.eql([
      { _key: '111', name: 'Honey 1.0' },
      { _key: '112', name: 'Honey 2.0' },
      { _key: '113', name: honey20Alt },
    ]);
  });

  it('should filter products by search query', async () => {
    const SEARCH_PRODUCTS = gql`
      query {
        products(query:"nice") {
          name,
          description
        }
      }
    `;

    const res = await query({ query: SEARCH_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 1.0', description: veryNiceHoney },
      { name: honey20Alt, description: 'Fake nice honey' },
    ]);
  });

  it('should filter products by categories', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(categories: ["honey"]) {
          name,
          categories
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 1.0', categories: ['honey'] },
      { name: 'Honey 2.0', categories: ['honey'] },
    ]);
  });

  it('should filter products by price', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(priceMin: 3, priceMax: 11) {
          name,
          price
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 2.0', price: 7.5 },
      { name: honey20Alt, price: 10.5 },
    ]);
  });

  it('should filter products by search query and categories', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(query: "nice", categories: ["honey"]) {
          name,
          description,
          categories
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 1.0', description: veryNiceHoney, categories: ['honey'] },
    ]);
  });

  it('should filter products by search query and price', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(query: "nice", priceMin: 0, priceMax: 5) {
          name,
          description,
          price
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 1.0', description: veryNiceHoney, price: 2.5 },
    ]);
  });

  it('should filter products by categories and price', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(categories: ["honey"], priceMin: 0, priceMax: 5) {
          name,
          categories,
          price
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 1.0', categories: ['honey'], price: 2.5 },
    ]);
  });

  it('should get all products and sort them by highest rating', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: RATING) {
          _key,
          rating,
        }
      }
    `;

    const response = await query({ query: GET_PRODUCTS });
    expect(response.data.products).to.eql([
      { _key: '113', rating: 3.7 },
      { _key: '112', rating: 3 },
      { _key: '111', rating: 2.3 },
    ]);
  });

  it('should get all products and sort them by lowest price', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: PRICE_LOW_HIGH) {
          _key,
          price
        }
      }
    `;

    const response = await query({ query: GET_PRODUCTS });
    expect(response.data.products).to.eql([
      { _key: '111', price: 2.5 },
      { _key: '112', price: 7.5 },
      { _key: '113', price: 10.5 },
    ]);
  });

  it('should get all products and sort them by highest price', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: PRICE_HIGH_LOW) {
          _key,
          price
        }
      }
    `;

    const response = await query({ query: GET_PRODUCTS });
    expect(response.data.products).to.eql([
      { _key: '113', price: 10.5 },
      { _key: '112', price: 7.5 },
      { _key: '111', price: 2.5 },
    ]);
  });

  it('should get all products and sort them by most recent', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: MOST_RECENT) {
          _key,
          publishedAt,
        }
      }
    `;

    const response = await query({ query: GET_PRODUCTS });
    expect(response.data.products).to.eql([
      { _key: '113', publishedAt: new Date('1/12/2012, 7:57:12 AM').toLocaleString() },
      { _key: '111', publishedAt: new Date('4/12/2019, 7:22:13 AM').toLocaleString() },
      { _key: '112', publishedAt: new Date('7/22/2018, 7:22:13 AM').toLocaleString() },
    ]);
  });

  it('should filter products by search query and sort them by lowest price', async () => {
    const SEARCH_PRODUCTS = gql`
      query {
        products(
          query:"honey",
          categories: ["honey"],
          priceMin: 0,
          priceMax: 5,
          sort: PRICE_LOW_HIGH
        ) {
            name,
            price
          }
      }
    `;

    const res = await query({ query: SEARCH_PRODUCTS });
    expect(res.data.products).to.eql([
      { name: 'Honey 1.0', price: 2.5 },
    ]);
  });

  after(async () => {
    await dropDB(dbName);
  });
});
