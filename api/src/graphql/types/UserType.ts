import 'reflect-metadata';
import { ObjectType as objectType, Field as field } from 'type-graphql';
import ImageType from './ImageType';

@objectType()
export default class UserType {
  @field({ nullable: true })
  readonly _key?: string;

  @field()
  name: string;

  @field()
  phone: string;

  @field()
  email: string;

  @field()
  birthday: string;

  @field()
  address: string;

  @field(() => ImageType)
  photo: ImageType;

  @field(() => ImageType)
  banner: ImageType;
}
