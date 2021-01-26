import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';
import UserType from './UserType';
import ProductType from './ProductType';
import LocationType from './LocationType';

@objectType()
export default class ProducerType extends UserType {
  @field()
  description: string;

  @field(() => [ProductType])
  products: ProductType[] = [];

  @field(() => LocationType)
  location: LocationType;
}
