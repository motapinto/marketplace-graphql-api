import 'reflect-metadata';
import {
  ObjectType as objectType,
  Field as field,
} from 'type-graphql';
import ProductType from './ProductType';

export enum PurchaseState{
  ORDERED = 'ORDERED',
  PAID = 'PAID',
}

@objectType()
export default class PurchasesType {
  @field()
  readonly _key: string;

  @field(() => [ProductType])
  products: ProductType[];

  @field()
  status: PurchaseState;

  @field()
  reference: string;

  @field()
  entity: string;

  @field()
  buyer: string;
}
