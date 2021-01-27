import { gql } from 'apollo-server-express';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

const chai = require('chai');

const { expect } = chai;
chai.use(require('chai-sorted'));

describe('Products integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'products_test';
  const returnArgs = `
    _key,
    name,
    description,
    price,
    stock,
    publishedAt,
    images {dataLocation},
    location{latitude, longitude},
    categories{name},     
    reviews {_key}
    rating
  `;

  before(async () => {
    await populate(dbName);
  });

  it('should get all products', async () => {
    const GET_PRODUCTS = gql`
      query {
        products {
         ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCTS });
    expect(res.data.products.length).to.eql(13);
  });

  it('should get a product', async () => {
    const GET_PRODUCT = gql`
      query {
        product(key: "111") {
         ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCT });
    expect(res.data.product.name).to.eql('Honey');
  });

  it('should add a product', async () => {
    const ADD_PRODUCT = gql`
      mutation {
        addProduct(
          product: {
            name: "Test Product"
            description: "Test description"
            price: 10
            stock: 10
            images: { dataLocation: "example.jpeg" }
            location: { latitude: 12, longitude: 12 }
            categories: [{_key: "2", name: "milk"}]
            producer: "1"
          }
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: ADD_PRODUCT });
    expect(res.data.addProduct.name).to.eql('Test Product');
  });

  it('should remove a product', async () => {
    const REMOVE_PRODUCT = gql`
      mutation {
        removeProduct(key: "111") {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_PRODUCT });
    expect(res.data.removeProduct.name).to.eql('Honey');
  });

  it('should update a product', async () => {
    const UPDATE_PRODUCT = gql`
      mutation {
        updateProduct(
          product: {
            _key: "113"
            name: "Jammy Jam"
          }
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_PRODUCT });
    expect(res.data.updateProduct.name).to.eql('Jammy Jam');
  });

  it('should get all products and sort them by highest rating', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: RATING) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCTS });
    expect(res.data.products).to.be.sortedBy('rating', { descending: true });
  });

  it('should get all products and sort them by lowest price', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: PRICE_LOW_HIGH) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCTS });
    expect(res.data.products).to.be.sortedBy('price', { descending: false });
  });

  it('should get all products and sort them by highest price', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: PRICE_HIGH_LOW) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCTS });
    expect(res.data.products).to.be.sortedBy('price', { descending: true });
  });

  it('should get all products and sort them by most recent', async () => {
    const GET_PRODUCTS = gql`
      query {
        products(sort: MOST_RECENT) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: GET_PRODUCTS });
    expect(res.data.products).to.be.sortedBy('publishedAt', { descending: true });
  });

  it('should filter products by search query', async () => {
    const SEARCH_PRODUCTS = gql`
      query {
        products(query: "bread") {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: SEARCH_PRODUCTS });
    expect(res.data.products.length).to.eql(6);
  });

  it('should filter products by categories', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(categories: ["bread", "chicken"]) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products.length).to.eql(7);
  });

  it('should filter products by price', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(priceMin: 3, priceMax: 11) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    const productPrices = res.data.products.map((elem: any) => elem.price);
    expect(Math.min(...productPrices)).to.be.at.least(3);
    expect(Math.max(...productPrices)).to.be.at.most(11);
  });

  it('should filter products by search query and categories', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(query: "focaccia", categories: ["bread"]) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    expect(res.data.products.length).to.eql(1);
  });

  it('should filter products by search query and price', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(query: "fresh", priceMin: 0, priceMax: 5) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    const productPrices = res.data.products.map((elem: any) => elem.price);
    expect(res.data.products.length).to.eql(3);
    expect(Math.min(...productPrices)).to.be.at.least(0);
    expect(Math.max(...productPrices)).to.be.at.most(5);
  });

  it('should filter products by categories and price', async () => {
    const FILTER_PRODUCTS = gql`
      query {
        products(categories: ["bread"], priceMin: 0, priceMax: 4.5) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: FILTER_PRODUCTS });
    const productPrices = res.data.products.map((elem: any) => elem.price);
    expect(res.data.products.length).to.eql(3);
    expect(Math.min(...productPrices)).to.be.at.least(0);
    expect(Math.max(...productPrices)).to.be.at.most(4.5);
  });

  it('should filter products by search query and sort them by lowest price', async () => {
    const SEARCH_PRODUCTS = gql`
      query {
        products(
          query: "fresh"
          categories: ["bread", "milk"]
          priceMin: 0
          priceMax: 5
          sort: PRICE_LOW_HIGH
        ) {
          ${returnArgs}
        }
      }
    `;

    const res = await query({ query: SEARCH_PRODUCTS });
    expect(res.data.products.length).to.eql(3);
  });

  after(async () => {
    await dropDB(dbName);
  });
});
