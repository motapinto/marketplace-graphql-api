import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';

@objectType()
export default class ImageType {
  @field()
  dataLocation: string;
}
