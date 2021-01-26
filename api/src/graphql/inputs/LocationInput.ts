import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
  Float as float,
} from 'type-graphql';
import { Min as min, Max as max } from 'class-validator';

import LocationType from '../types/LocationType';

@inputType()
export default class LocationInput implements Partial<LocationType> {
  @field(() => float)
  @min(-90.0)
  @max(90.0)
  latitude: number;

  @field(() => float)
  @min(-180.0)
  @max(180.0)
  longitude: number;
}
