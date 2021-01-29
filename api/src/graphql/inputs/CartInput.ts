import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
} from 'type-graphql';
import {
  IsNotEmpty as isNotEmpty,
  Min as min,
} from 'class-validator';

@inputType()
export default class CartProductInput {
  @field({ nullable: true })
  readonly _key?: string;

  @field()
  @isNotEmpty()
  productKey: string;

  @field()
  @isNotEmpty()
  buyerKey: string;

  @field()
  @min(0)
  quantity: number;
}
