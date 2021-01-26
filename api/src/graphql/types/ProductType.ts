import 'reflect-metadata';
import {
  ObjectType as objectType,
  Field as field,
  Float as float,
} from 'type-graphql';
import ReviewType from './ReviewType';
import ImageType from './ImageType';
import LocationType from './LocationType';
import CategoryType from './CategoryType';

@objectType()
export default class ProductType {
  @field({ nullable: true })
  readonly _key?: string;

  @field()
  name: string;

  @field()
  description: string;

  @field(() => float)
  price: number;

  @field()
  stock: number;

  @field(() => [ImageType])
  images: ImageType[];

  @field()
  publishedAt: string;

  @field(() => LocationType)
  location: LocationType;

  @field(() => [CategoryType])
  categories: CategoryType[] = [];

  @field(() => [ReviewType])
  reviews: ReviewType[] = [];

  @field(() => float, { nullable: true })
  rating?: number;

  @field()
  producer: string;
}
