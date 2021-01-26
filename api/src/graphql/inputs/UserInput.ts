import 'reflect-metadata';
import { InputType as inputType, Field as field } from 'type-graphql';
import {
  IsNotEmpty as isNotEmpty,
  IsMobilePhone as isMobilePhone,
  IsEmail as isEmail,
} from 'class-validator';
import UserType from '../types/UserType';
import ImageInput from './ImageInput';

@inputType()
export class AddUserInput implements Partial<UserType> {
  @field()
  @isNotEmpty()
  name: string;

  @field()
  @isNotEmpty()
  @isMobilePhone('pt-PT')
  phone: string;

  @field()
  @isEmail()
  email: string;

  @field()
  birthday: string;

  @field()
  @isNotEmpty()
  address: string;

  @field(() => ImageInput)
  photo: ImageInput;

  @field(() => ImageInput)
  banner: ImageInput;
}

@inputType()
export class UpdateUserInput implements Partial<UserType> {
  @field({ nullable: true })
  @isNotEmpty()
  name?: string;

  @field({ nullable: true })
  @isNotEmpty()
  @isMobilePhone('pt-PT')
  phone?: string;

  @field({ nullable: true })
  @isEmail()
  email?: string;

  @field({ nullable: true })
  birthday?: string;

  @field({ nullable: true })
  @isNotEmpty()
  address?: string;

  @field(() => ImageInput, { nullable: true })
  photo?: ImageInput;

  @field(() => ImageInput, { nullable: true })
  banner?: ImageInput;
}
