import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
} from 'type-graphql';

@inputType()
export class PurchasesInput implements Partial<PurchasesInput> {
  @field()
  buyerKey: string;

  @field()
  orderKey: string;
}
