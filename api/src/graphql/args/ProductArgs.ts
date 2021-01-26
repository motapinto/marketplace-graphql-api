import {
  Float as float,
  ArgsType as argsType,
  Field as field,
  registerEnumType,
} from 'type-graphql';
import { IsEnum as isEnum, Min as min } from 'class-validator';
import { Sort } from '../types/sortEnum';

registerEnumType(Sort, { name: 'Sort' });

@argsType()
export default class SearchProductArgs {
  @field({ nullable: true })
  query?: string;

  @field(() => [String], { nullable: true })
  categories?: string[];

  @field(() => float, { nullable: true })
  @min(0)
  priceMin?: number;

  @field(() => float, { nullable: true })
  priceMax?: number;

  @field(() => Sort, { nullable: true })
  @isEnum(Sort)
  sort?: Sort;
}
