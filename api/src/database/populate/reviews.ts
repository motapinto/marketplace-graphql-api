import Review from '../../models/Review';
import Product from '../../models/Product';
import Buyer from '../../models/Buyer';
import { AddReviewInput } from '../../graphql/inputs/ReviewInput';

const addReviews = async () => {
  const products = await Promise.all([
    Product.get('111'),
    Product.get('112'),
    Product.get('113'),
    Product.get('114'),
    Product.get('115'),
    Product.get('116'),
    Product.get('117'),
    Product.get('118'),
  ]);

  const buyers = await Promise.all([
    Buyer.get('1'),
    Buyer.get('2'),
  ]);

  return Promise.all([
    Review.add(Object.assign(new AddReviewInput(), {
      _key: '1',
      productKey: products[0]._key,
      title: 'Please stay away',
      comment: 'This had a very bad taste please run from this!!',
      rating: 3,
      buyerKey: buyers[0]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '2',
      productKey: products[0]._key,
      title: 'I think I got sick from this',
      comment: 'I think this is a grave problem and should be address. The food we buy here cannot be like this!!!',
      rating: 1,
      buyerKey: buyers[1]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '3',
      productKey: products[5]._key,
      title: 'Average product',
      comment: 'Its an average experience, but won\'t buy it again, for sure ',
      rating: 3,
      buyerKey: buyers[0]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '4',
      productKey: products[1]._key,
      title: 'Bad taste',
      comment: 'The product was in a good state, but the smell and taste were awful',
      rating: 2,
      buyerKey: buyers[1]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '5',
      productKey: products[1]._key,
      title: 'Great product',
      comment: 'One of the best that I ever tried! This was a great experience :) !!',
      rating: 4,
      buyerKey: buyers[0]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '6',
      productKey: products[5]._key,
      title: 'Not that great',
      comment: 'It was very average ...',
      rating: 3,
      buyerKey: buyers[1]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '7',
      productKey: products[7]._key,
      title: 'Wowww',
      comment: 'This was amazing!!',
      rating: 5,
      buyerKey: buyers[0]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '8',
      productKey: products[2]._key,
      title: 'Fantastic offer here',
      comment: 'I would reccommend everyone to try it out!!',
      rating: 4,
      buyerKey: buyers[1]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '9',
      productKey: products[3]._key,
      title: 'Great experience',
      comment: 'Good price/quality service here',
      rating: 4,
      buyerKey: buyers[0]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '10',
      productKey: products[4]._key,
      title: 'Average experience',
      comment: 'Medium price/quality service here',
      rating: 4,
      buyerKey: buyers[1]._key,
    })),

    Review.add(Object.assign(new AddReviewInput(), {
      _key: '11',
      productKey: products[6]._key,
      title: 'Out of this world',
      comment: 'The taste and freshness is something I will never forget',
      rating: 5,
      buyerKey: buyers[0]._key,
    })),
  ]);
};

export default addReviews;
