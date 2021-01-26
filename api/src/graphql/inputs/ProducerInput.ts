import 'reflect-metadata';
import { InputType as inputType, Field as field } from 'type-graphql';
import { IsNotEmpty as isNotEmpty } from 'class-validator';
import ProducerType from '../types/ProducerType';
import { AddUserInput, UpdateUserInput } from './UserInput';
import LocationInput from './LocationInput';

@inputType()
export class AddProducerInput extends AddUserInput implements Partial<ProducerType> {
  @field()
  @isNotEmpty()
  description: string;

  @field(() => LocationInput)
  @isNotEmpty()
  location: LocationInput;
}

@inputType()
export class UpdateProducerInput extends UpdateUserInput implements Partial<ProducerType> {
  @field()
  @isNotEmpty()
  _key: string;

  @field({ nullable: true })
  @isNotEmpty()
  description?: string;

  @field(() => LocationInput, { nullable: true })
  @isNotEmpty()
  location?: LocationInput;
}
