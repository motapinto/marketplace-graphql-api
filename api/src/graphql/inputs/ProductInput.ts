import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
  Float as float,
} from 'type-graphql';
import {
  Min as min,
  Length as length,
  ArrayNotEmpty as arrayNotEmpty,
  IsNotEmpty as isNotEmpty,
} from 'class-validator';
import ProductType from '../types/ProductType';
import ImageInput from './ImageInput';
import LocationInput from './LocationInput';
import { UpdateCategoryInput } from './CategoryInput';

@inputType()
export class AddProductInput implements Partial<ProductType> {
  @field()
  @isNotEmpty()
  @length(3, 40)
  name: string;

  @field()
  @isNotEmpty()
  @length(10, 500)
  description: string;

  @field(() => float)
  @min(0)
  price: number;

  @field()
  @min(1)
  stock: number;

  @field(() => [ImageInput], { nullable: true })
  images: ImageInput[];

  @field(() => LocationInput)
  location: LocationInput;

  @field(() => [UpdateCategoryInput])
  @isNotEmpty()
  @arrayNotEmpty()
  categories: UpdateCategoryInput[];

  @field()
  @isNotEmpty()
  producer: string;
}

@inputType()
export class UpdateProductInput implements Partial<ProductType> {
  @field()
  @isNotEmpty()
  readonly _key: string;

  @field({ nullable: true })
  @isNotEmpty()
  @length(3, 40)
  name?: string;

  @field({ nullable: true })
  @isNotEmpty()
  @length(10, 500)
  description?: string;

  @field(() => float, { nullable: true })
  @min(0)
  price?: number;

  @field({ nullable: true })
  @min(1)
  stock?: number;

  @field(() => [ImageInput], { nullable: true })
  images?: ImageInput[];

  @field(() => LocationInput, { nullable: true })
  location?: LocationInput;

  @field(() => [UpdateCategoryInput], { nullable: true })
  @isNotEmpty()
  @arrayNotEmpty()
  categories?: UpdateCategoryInput[];
}

@inputType()
export class CartProductInput implements Partial<ProductType> {
  @field()
  readonly _key: string;

  @field()
  @length(0, 20)
  name: string;

  @field(() => float)
  @min(0)
  price: number;
}
