import 'reflect-metadata';
import {
  Resolver as resolver,
  Arg as arg,
  Query as query,
  Mutation as mutation,
} from 'type-graphql';
import Review from '../../models/Review';
import ReviewType from '../types/ReviewType';
import { AddReviewInput, UpdateReviewInput } from '../inputs/ReviewInput';

@resolver(() => ReviewType)
export default class ReviewResolver {
  @query(() => [ReviewType])
  public async reviews() {
    return Review.getAll();
  }

  @query(() => ReviewType)
  public async review(@arg('_key') key: string) {
    return Review.get(key);
  }

  @mutation(() => ReviewType)
  public async addReview(@arg('review') review: AddReviewInput) {
    return Review.add(review);
  }

  @mutation(() => ReviewType)
  public async removeReview(@arg('_key') key: string) {
    return Review.remove(key);
  }

  @mutation(() => ReviewType)
  public async updateReview(@arg('review') review: UpdateReviewInput) {
    return Review.update(review);
  }
}
