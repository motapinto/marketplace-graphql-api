import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
  Float as float,
  Int as int,
} from 'type-graphql';

@inputType()
export default class AddOrderInput {
  @field()
  readonly _key: string;

  @field()
  readonly productKey: string;

  @field()
  readonly buyerKey: string;

  @field(() => float)
  price: number;

  @field(() => int)
  units: string;

  @field()
  date: string;

  @field({ nullable: true })
  eta?: string;

  @field()
  inProgress: boolean;
}
