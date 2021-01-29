/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';
import UserType from './UserType';
import OrderType from './OrderType';
import ReviewType from './ReviewType';
import CategoryType from './CategoryType';
import CartType from './CartType';

@objectType()
export default class BuyerType extends UserType {
  @field()
  points: number = 0;

  @field(() => [ReviewType])
  reviews: ReviewType[] = [];

  @field(() => [CategoryType])
  categories: CategoryType[] = [];

  @field(() => CartType)
  cart: CartType;

  @field(() => [OrderType])
  orders: OrderType[] = [];
}
