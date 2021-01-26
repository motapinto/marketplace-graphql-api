import 'reflect-metadata';
import { InputType as inputType, Field as field } from 'type-graphql';
import {
  ArrayNotEmpty as arrayNotEmpty,
  IsNotEmpty as isNotEmpty,
} from 'class-validator';
import BuyerType from '../types/BuyerType';
import { AddUserInput, UpdateUserInput } from './UserInput';
import { UpdateCategoryInput } from './CategoryInput';

@inputType()
export class AddBuyerInput extends AddUserInput implements Partial<BuyerType> {
  @field(() => [UpdateCategoryInput])
  @isNotEmpty()
  @arrayNotEmpty()
  categories: UpdateCategoryInput[];
}

@inputType()
export class UpdateBuyerInput extends UpdateUserInput {
  @field()
  _key: string;

  @field(() => [UpdateCategoryInput], { nullable: true })
  @isNotEmpty()
  @arrayNotEmpty()
  categories?: UpdateCategoryInput[];
}
