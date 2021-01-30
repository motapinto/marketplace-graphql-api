import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
  Int as int,
} from 'type-graphql';
import {
  IsNotEmpty as isNotEmpty,
  Min as min,
} from 'class-validator';

@inputType()
export default class AddOrderInput {
  @field()
  @isNotEmpty()
  productKey: string;

  @field()
  @isNotEmpty()
  buyerKey: string;

  @field(() => int)
  @min(1)
  quantity: number;
}
