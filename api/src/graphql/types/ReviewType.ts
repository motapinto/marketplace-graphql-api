import 'reflect-metadata';
import {
  ObjectType as objectType,
  Field as field,
  Float as float,
} from 'type-graphql';

@objectType()
export default class ReviewType {
  @field({ nullable: true })
  readonly _key?: string;

  @field()
  buyerKey: string;

  @field()
  productKey: string;

  @field()
  title: string;

  @field()
  comment: string;

  @field(() => float)
  rating: number;

  @field()
  date: string;
}
