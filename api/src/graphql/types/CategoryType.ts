import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';

@objectType()
export default class CategoryType {
  @field({ nullable: true })
  readonly _key?: string;

  @field()
  name: string;
}
