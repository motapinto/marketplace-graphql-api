/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { ObjectType as objectType, Field as field, Float as float } from 'type-graphql';
import ProductType from './ProductType';

@objectType()
export class CartProductType {
  @field()
  readonly _key: string;

  @field()
  product: ProductType;

  @field()
  quantity: number;
}

@objectType()
export default class CartType {
  @field(() => [CartProductType])
  list: CartProductType[] = [];

  @field(() => float)
  price: number;
}
