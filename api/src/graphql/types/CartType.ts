import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';
import UserType from './UserType';
import ProductInCart from './ProductInCart';

@objectType()
export default class Cart {
  @field()
  readonly _key: string;

  @field({ nullable: true })
  user: UserType;

  @field(() => [ProductInCart], { nullable: true })
  list:ProductInCart[];
}
