import 'reflect-metadata';
import { InputType as inputType, Field as field } from 'type-graphql';
import CategoryType from '../types/CategoryType';

@inputType()
export class AddCategoryInput implements Partial<CategoryType> {
  @field()
  name: string;
}

@inputType()
export class UpdateCategoryInput implements Partial<CategoryType> {
  @field()
  readonly _key: string;

  @field()
  name: string;
}