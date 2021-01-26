import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';
/* eslint-disable import/no-cycle */
import UserType from './UserType';
import OrderType from './OrderType';
import ReviewType from './ReviewType';
import CategoryType from './CategoryType';

@objectType()
export default class BuyerType extends UserType {
  @field()
  points: number = 0;

  @field(() => [OrderType])
  orders: OrderType[] = [];

  @field(() => [ReviewType])
  reviews: ReviewType[] = [];

  @field(() => [CategoryType])
  categories: CategoryType[] = [];
}
