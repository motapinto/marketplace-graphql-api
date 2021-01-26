import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Reviews integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'reviews_test';

  before(async () => {
    await populate(dbName);
  });

  it('should get a review', async () => {
    const GET_REVIEW = gql`
      query {
        review(_key: "401") {
          _key
          title        
        }
      }
    `;

    const res = await query({ query: GET_REVIEW });
    expect(res.data.review).to.eql({ _key: '401', title: 'Could be worse' });
  });

  it('should get all reviews', async () => {
    const GET_REVIEWS = gql`
      query {
        reviews {
          _key
          buyerKey
          productKey
          title
          comment
          rating
          date
        }
      }
    `;

    const res = await query({ query: GET_REVIEWS });
    expect(res.data.reviews).to.have.length(9);
  });

  it('should get a product\'s reviews', async () => {
    const GET_REVIEWS = gql`
      query {
        product(_key: "111") {
          reviews {
            _key,
            buyerKey,
            productKey,
            title,
            comment,
            rating,
      
          }        
        }
      }
    `;

    const res = await query({ query: GET_REVIEWS });
    expect(res.data.product.reviews).to.have.length(3);
  });

  it('should get a buyer\'s review', async () => {
    const GET_REVIEWS = gql`
      query {
        buyer(key: "123") {
          reviews {
            _key
            title
          }        
        }
      }
    `;

    const res = await query({ query: GET_REVIEWS });
    expect(res.data.buyer.reviews).to.have.length(9);
  });

  it('should add a review to a product', async () => {
    const ADD_REVIEW = gql`
      mutation {
        addReview(
          review: {
            _key: "649316"
            buyerKey: "111"
            productKey: "111"
            title: "Something"
            comment: "asd"
            rating: 5
            date: "12/4/2020, 9:00:15 PM"
          }
        ) {
          _key
          title
        }
      }
    `;

    const res = await mutate({ mutation: ADD_REVIEW });
    expect(res.data.addReview).to.eql({ _key: '649316', title: 'Something' });
  });

  it('should update a review from a product', async () => {
    const UPDATE_REVIEW = gql`
      mutation {
        updateReview(
          review: {
            _key: "649316"
            title: "Something else"
          }
        ) {
          title
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_REVIEW });
    expect(res.data.updateReview).to.eql({ title: 'Something else' });
  });

  it('should remove a review from a product', async () => {
    const REMOVE_REVIEW = gql`
      mutation {
        removeReview(_key: "649316") {
          _key
          title
        }
      }
    `;

    const res = await mutate({ mutation: REMOVE_REVIEW });
    expect(res.data.removeReview).to.eql({ _key: '649316', title: 'Something else' });
  });

  after(async () => {
    await dropDB(dbName);
  });
});
