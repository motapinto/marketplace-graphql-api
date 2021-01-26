import 'reflect-metadata';
import {
  Resolver as resolver,
  Arg as arg,
  Query as query,
  Mutation as mutation,
} from 'type-graphql';
import Category from '../../models/Category';
import CategoryType from '../types/CategoryType';
import { AddCategoryInput, UpdateCategoryInput } from '../inputs/CategoryInput';

@resolver(() => CategoryType)
export default class CategoryResolver {
  @query(() => [CategoryType], { defaultValue: [] })
  async categories() {
    return Category.getAll();
  }

  @query(() => CategoryType, { nullable: true })
  async category(@arg('key') key: string) {
    return Category.get(key);
  }

  @mutation(() => CategoryType, { nullable: true })
  async addCategory(@arg('category') category: AddCategoryInput) {
    return Category.add(category);
  }

  @mutation(() => CategoryType, { nullable: true })
  async removeCategory(@arg('key') key: string) {
    return Category.remove(key);
  }

  @mutation(() => CategoryType, { nullable: true })
  async updateCategory(@arg('category') category: UpdateCategoryInput) {
    return Category.update(category);
  }
}
