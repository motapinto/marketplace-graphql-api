import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';
import ProductType from './ProductType';

@objectType()
export default class ProductInCart {
  @field()
  product:ProductType;

  @field()
  quantity:number;
}
