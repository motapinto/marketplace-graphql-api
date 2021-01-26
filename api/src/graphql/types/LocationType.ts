import 'reflect-metadata';
import {
  ObjectType as objectType,
  Field as field,
  Float as float,
} from 'type-graphql';

@objectType()
export default class LocationType {
  @field(() => float)
  latitude: number;

  @field(() => float)
  longitude: number;
}
