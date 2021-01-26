import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Reviews integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'reviews_test';
  const returnArgs = `
    _key
    buyerKey
    productKey
    title
    comment
    rating
    date
  `

  before(async () => {
    await populate(dbName);
  });

  it('should get all reviews', async () => {
    const GET_REVIEWS = gql`
      query {
        reviews {
          ${returnArgs}    
        }
      }
    `;

    const res = await query({ query: GET_REVIEWS });
    expect(res.data.reviews).to.have.length(11);
  });

  it('should get a review', async () => {
    const GET_REVIEW = gql`
      query {
        review(key: "1") {
          ${returnArgs}     
        }
      }
    `;

    const res = await query({ query: GET_REVIEW });
    expect(res.data.review.title).to.eql('Please stay away');
  });

  it('should get a product\'s reviews', async () => {
    const GET_REVIEWS = gql`
      query {
        product(key: "111") {
          reviews {
            ${returnArgs}    
          }        
        }
      }
    `;

    const res = await query({ query: GET_REVIEWS });
    expect(res.data.product.reviews).to.have.length(2);
  });

  it('should get a buyer\'s review', async () => {
    const GET_REVIEWS = gql`
      query {
        buyer(key: "1") {
          reviews {
            ${returnArgs}    
          }        
        }
      }
    `;

    const res = await query({ query: GET_REVIEWS });
    expect(res.data.buyer.reviews).to.have.length(6);
  });

  it('should add a review', async () => {
    const ADD_REVIEW = gql`
      mutation {
        addReview(
          review: {
            buyerKey: "1"
            productKey: "111"
            title: "Something"
            comment: "else return it"
            rating: 5
          }
        ) {
          ${returnArgs}    
        }
      }
    `;

    const res = await mutate({ mutation: ADD_REVIEW });
    expect(res.data.addReview.title).to.eql('Something');
  });

  it('should update a review', async () => {
    const UPDATE_REVIEW = gql`
      mutation {
        updateReview(
          review: {
            _key: "1"
            title: "Run from this"
          }
        ) {
          ${returnArgs}    
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_REVIEW });
    expect(res.data.updateReview.title).to.eql('Run from this');
  });

  it('should remove a review', async () => {
    const REMOVE_REVIEW = gql`
      mutation {
        removeReview(key: "1") {
          ${returnArgs}    
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_REVIEW });
    expect(res.data.removeReview.title).to.eql('Run from this');
  });

  after(async () => {
    await dropDB(dbName);
  });
});
