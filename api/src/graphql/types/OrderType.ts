import 'reflect-metadata';
import {
  ObjectType as objectType,
  Field as field,
  Float as float,
  Int as int,
} from 'type-graphql';
/* eslint-disable import/no-cycle */
import BuyerType from './BuyerType';
import ProductType from './ProductType';

@objectType()
export default class OrderType {
  @field()
  readonly _key: string;

  @field(() => ProductType)
  product: ProductType;

  @field(() => BuyerType)
  buyer: BuyerType;

  @field(() => float)
  price: number;

  @field(() => int)
  units: number;

  @field({ defaultValue: new Date().toLocaleString() })
  date: string;

  @field({ nullable: true })
  eta?: string;

  @field()
  inProgress: boolean;
}
