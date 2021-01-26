import 'reflect-metadata';
import {
  InputType as inputType,
  Field as field,
  Float as float,
} from 'type-graphql';
import {
  Min as min,
  Max as max,
  Length as length,
  IsNotEmpty as isNotEmpty,
} from 'class-validator';
import ReviewType from '../types/ReviewType';

@inputType()
export class AddReviewInput implements Partial<ReviewType> {
  @field()
  @isNotEmpty()
  buyerKey: string;

  @field()
  @isNotEmpty()
  productKey: string;

  @field()
  @length(1, 100)
  title: string;

  @field()
  @length(10, 250)
  comment: string;

  @field(() => float)
  @min(0.0)
  @max(5.0)
  rating: number;
}

@inputType()
export class UpdateReviewInput implements Partial<ReviewType> {
  @field()
  @isNotEmpty()
  _key: string;

  @field({ nullable: true })
  @length(1, 100)
  title?: string;

  @field({ nullable: true })
  @length(10, 250)
  comment?: string;

  @field(() => float, { nullable: true })
  @min(0.0)
  @max(5.0)
  rating?: number;
}
