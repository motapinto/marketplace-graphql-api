import 'reflect-metadata';
import { InputType as inputType, Field as field } from 'type-graphql';
import { CartProductInput } from './ProductInput';

@inputType()
export class CartItem {
  @field()
  userKey:string;

  @field(() => CartProductInput)
  product:CartProductInput;

  @field()
  quantity:number;
}

@inputType()
export class ReduceCartItem {
  @field()
  userKey:string;

  @field()
  product:string;
}
