import 'reflect-metadata';
import { InputType as inputType, Field as field } from 'type-graphql';
import { IsDataURI as isDataUri } from 'class-validator';

import ImageType from '../types/ImageType';

@inputType()
export default class ImageInput implements Partial<ImageType> {
  @field()
  @isDataUri()
  dataLocation: string;
}
